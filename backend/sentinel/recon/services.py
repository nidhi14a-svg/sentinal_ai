import shutil
import socket
import ssl
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Any

try:
    import dns.resolver
except ImportError:  # pragma: no cover
    dns = None

try:
    import whois
except ImportError:  # pragma: no cover
    whois = None

from .configuration import ReconConfig
from .exceptions import (
    ReconServiceError,
    TargetNotAllowedError,
    InvalidDomainError,
    DnsLookupError,
    WhoisLookupError,
    SslInspectionError,
    DomainReconUnexpectedError,
)
from .interfaces import ReconInterface
from .models import ReconResult
from .utilities import build_recon_summary, parse_dns_records


def verify_allowed_domain(domain: str, allowlist: set[str]) -> bool:
    """Domain validation helper."""
    return domain.strip().lower() in {item.strip().lower() for item in allowlist}


def build_recon_payload(recon_data: dict[str, Any]) -> dict[str, Any]:
    """Data adapter converting raw data into a camelCase reconnaissance payload."""
    timestamp = recon_data.get("timestamp") or datetime.utcnow().isoformat() + "Z"
    dns_raw = recon_data.get("dns_records") or recon_data.get("dnsRecords") or {}
    dns_parsed = parse_dns_records(dns_raw)

    payload = {
        "targetDomain": recon_data.get("target_domain") or recon_data.get("targetDomain") or "",
        "isAllowedTarget": bool(recon_data.get("is_allowed_target") or recon_data.get("isAllowedTarget")),
        "dnsRecords": dns_parsed,
        "whoisData": recon_data.get("whois_data") or recon_data.get("whoisData") or {},
        "sslCertificate": recon_data.get("ssl_certificate") or recon_data.get("sslCertificate") or {},
        "discoveredServices": recon_data.get("discovered_services") or recon_data.get("discoveredServices") or [],
        "reconSummary": recon_data.get("recon_summary") or recon_data.get("reconSummary") or "",
        "timestamp": timestamp,
    }
    
    # Auto-generate summary if empty
    if not payload["reconSummary"]:
        payload["reconSummary"] = build_recon_summary(payload)
        
    return payload


def run_recon(domain: str, scan_profile: str) -> dict[str, Any]:
    """Module-level run_recon that delegates to ReconService."""
    return ReconService().run_recon(domain, scan_profile)


class ReconService(ReconInterface):
    """Concrete reconnaissance service implementation."""

    def __init__(self, config: ReconConfig | None = None) -> None:
        self.config = config or ReconConfig()

    def load_allowlist(self) -> set[str]:
        path = Path(self.config.allowlist_file)
        if not path.exists():
            local_path = Path(__file__).resolve().parents[3] / "sample_target" / "allowlist.txt"
            if local_path.exists():
                path = local_path
        try:
            with open(path, "r", encoding="utf-8") as handle:
                return {
                    line.strip().lower()
                    for line in handle
                    if line.strip() and not line.strip().startswith("#")
                }
        except FileNotFoundError as exc:
            raise ReconServiceError(f"Allowlist file not found: {exc}") from exc
        except OSError as exc:
            raise ReconServiceError(f"Unable to read allowlist: {exc}") from exc

    def is_allowed_target(self, domain: str) -> bool:
        allowlist = self.load_allowlist()
        return verify_allowed_domain(domain, allowlist)

    def resolve_dns(self, domain: str) -> dict[str, list[str]]:
        records: dict[str, list[str]] = {}
        if dns is None:
            raise DnsLookupError("dns.resolver is unavailable", retryable=False)

        # Basic syntax check
        if not domain or "." not in domain:
            raise InvalidDomainError(f"Invalid domain format: {domain}")

        has_any_answer = False
        last_exception = None

        for record_type in ["A", "AAAA", "MX", "NS", "TXT"]:
            try:
                answers = dns.resolver.resolve(domain, record_type, lifetime=self.config.dns_timeout_seconds)
                record_values = [str(rdata).strip() for rdata in answers]
                records[record_type] = record_values
                if record_values:
                    has_any_answer = True
            except dns.resolver.NoAnswer:
                records[record_type] = []
            except dns.resolver.NXDOMAIN as exc:
                records[record_type] = []
                last_exception = exc
            except Exception as exc:
                records[record_type] = []
                last_exception = exc

        # If we couldn't resolve anything and had an exception, throw DnsLookupError
        if not has_any_answer and last_exception:
            if isinstance(last_exception, dns.resolver.NXDOMAIN):
                # Non-existent domain is a lookup error but usually not retryable if domain doesn't exist
                raise DnsLookupError(f"NXDOMAIN: Domain {domain} does not exist", retryable=False)
            raise DnsLookupError(f"DNS resolution failed: {last_exception}", retryable=True)

        return records

    def get_whois(self, domain: str) -> dict[str, Any]:
        if whois is None:
            raise WhoisLookupError("python-whois is unavailable")

        try:
            raw = whois.whois(domain)
            if not raw or not getattr(raw, "domain_name", None):
                raise WhoisLookupError("WHOIS returned empty or invalid records")
            return {
                "domain_name": raw.domain_name,
                "registrar": raw.registrar,
                "creation_date": str(raw.creation_date),
                "expiration_date": str(raw.expiration_date),
                "name_servers": raw.name_servers,
                "emails": raw.emails,
                "status": raw.status,
            }
        except Exception as exc:
            if isinstance(exc, WhoisLookupError):
                raise exc
            raise WhoisLookupError(f"WHOIS lookup failed: {exc}") from exc

    def inspect_ssl(self, domain: str) -> dict[str, Any]:
        cert_data: dict[str, Any] = {}
        try:
            with socket.create_connection((domain, 443), timeout=self.config.dns_timeout_seconds) as sock:
                context = ssl.create_default_context()
                with context.wrap_socket(sock, server_hostname=domain) as ssock:
                    cert = ssock.getpeercert()
                    if not cert:
                        raise SslInspectionError("No SSL certificate returned by host")
                    cert_data = {
                        "subject": cert.get("subject"),
                        "issuer": cert.get("issuer"),
                        "notBefore": cert.get("notBefore"),
                        "notAfter": cert.get("notAfter"),
                        "serialNumber": cert.get("serialNumber"),
                        "subjectAltName": cert.get("subjectAltName"),
                    }
        except Exception as exc:
            raise SslInspectionError(f"SSL inspection failed: {exc}") from exc
        return cert_data

    def probe_service_ports(self, domain: str) -> list[str]:
        services: list[str] = []
        for port, name in [(80, "http"), (443, "https")]:
            try:
                with socket.create_connection((domain, port), timeout=self.config.dns_timeout_seconds):
                    services.append(name)
            except Exception:
                continue
        return services

    def run_sslyze_inspection(self, domain: str) -> dict[str, Any]:
        if not shutil.which("sslyze"):
            return {"note": "sslyze CLI not available on PATH"}

        command = ["sslyze", "--regular", f"{domain}:443"]
        try:
            result = subprocess.run(command, capture_output=True, text=True, check=False, timeout=self.config.whois_timeout_seconds)
            return {
                "command": " ".join(command),
                "exit_code": result.returncode,
                "stdout": result.stdout.strip(),
                "stderr": result.stderr.strip(),
            }
        except subprocess.TimeoutExpired as exc:
            return {"error": f"sslyze scan timed out: {exc}"}
        except Exception as exc:
            return {"error": f"sslyze execution failed: {exc}"}

    def run_recon(self, domain: str, scan_profile: str) -> dict[str, Any]:
        """Public method defined in SPEC_DOMAIN_RECON.md. Returns exactly the camelCase JSON payload."""
        try:
            res_dict = self.run(domain, scan_profile)
            return build_recon_payload(res_dict)
        except (TargetNotAllowedError, InvalidDomainError, DnsLookupError, WhoisLookupError, SslInspectionError) as exc:
            raise exc
        except Exception as exc:
            raise DomainReconUnexpectedError(f"Unexpected recon failure: {exc}") from exc

    def run(self, domain: str, profile: str, dry_run: bool = False, verification: bool = False) -> dict[str, Any]:
        normalized_domain = domain.strip().lower()
        if not normalized_domain or "." not in normalized_domain:
            raise InvalidDomainError("Domain cannot be blank and must contain a dot")

        is_allowed = self.is_allowed_target(normalized_domain)
        if not is_allowed:
            raise TargetNotAllowedError(f"Target domain '{normalized_domain}' is not permitted by allowlist")

        recon_summary = "Verification only: allowlist validated." if verification else "Reconnaissance completed successfully."
        
        # In verification mode, we skip DNS/WHOIS/SSL actual socket lookups
        if verification:
            dns_records = {"verification": []}
            whois_data = {"verification": "skipped"}
            ssl_certificate = {"verification": "skipped"}
            discovered_services = ["verification"]
        else:
            dns_records = self.resolve_dns(normalized_domain)
            whois_data = self.get_whois(normalized_domain)
            ssl_certificate = self.inspect_ssl(normalized_domain)
            discovered_services = self.probe_service_ports(normalized_domain)

        result = ReconResult(
            target_domain=normalized_domain,
            is_allowed_target=is_allowed,
            dns_records=dns_records,
            whois_data=whois_data,
            ssl_certificate=ssl_certificate,
            discovered_services=discovered_services,
            recon_summary=recon_summary,
            timestamp=datetime.utcnow().isoformat() + "Z",
        )

        output = {
            "target_domain": result.target_domain,
            "is_allowed_target": result.is_allowed_target,
            "dns_records": result.dns_records,
            "whois_data": result.whois_data,
            "ssl_certificate": result.ssl_certificate,
            "discovered_services": result.discovered_services,
            "recon_summary": result.recon_summary,
            "timestamp": result.timestamp,
            "dry_run": dry_run,
            "verification": verification,
        }

        if dry_run:
            output["dry_run"] = True
            output["planned_steps"] = [
                "Validate allowlist",
                "Resolve DNS records",
                "Perform WHOIS lookup",
                "Inspect TLS certificate",
                "Probe HTTP/HTTPS ports",
            ]

        return output
