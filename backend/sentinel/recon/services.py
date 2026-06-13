import shutil
import socket
import ssl
import subprocess
from datetime import datetime
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
from .exceptions import ReconServiceError, TargetNotAllowedError
from .interfaces import ReconInterface
from .models import ReconResult


class ReconService(ReconInterface):
    """Concrete reconnaissance service implementation."""

    def __init__(self, config: ReconConfig | None = None) -> None:
        self.config = config or ReconConfig()

    def load_allowlist(self) -> set[str]:
        try:
            with open(self.config.allowlist_file, "r", encoding="utf-8") as handle:
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
        return domain.lower() in allowlist

    def resolve_dns(self, domain: str) -> dict[str, list[str]]:
        records: dict[str, list[str]] = {}
        if dns is None:
            return {"error": ["dns.resolver is unavailable"]}

        for record_type in ["A", "AAAA", "MX", "NS", "TXT"]:
            try:
                answers = dns.resolver.resolve(domain, record_type, lifetime=self.config.dns_timeout_seconds)
                record_values = [str(rdata).strip() for rdata in answers]
                records[record_type] = record_values
            except dns.resolver.NoAnswer:
                records[record_type] = []
            except dns.resolver.NXDOMAIN:
                records[record_type] = []
            except Exception:
                records[record_type] = []
        return records

    def get_whois(self, domain: str) -> dict[str, Any]:
        if whois is None:
            return {"error": "python-whois is unavailable"}

        try:
            raw = whois.whois(domain)
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
            return {"error": f"WHOIS lookup failed: {exc}"}

    def inspect_ssl(self, domain: str) -> dict[str, Any]:
        cert_data: dict[str, Any] = {}
        try:
            with socket.create_connection((domain, 443), timeout=self.config.dns_timeout_seconds) as sock:
                context = ssl.create_default_context()
                with context.wrap_socket(sock, server_hostname=domain) as ssock:
                    cert = ssock.getpeercert()
                    cert_data = {
                        "subject": cert.get("subject"),
                        "issuer": cert.get("issuer"),
                        "notBefore": cert.get("notBefore"),
                        "notAfter": cert.get("notAfter"),
                        "serialNumber": cert.get("serialNumber"),
                        "subjectAltName": cert.get("subjectAltName"),
                    }
        except Exception as exc:
            cert_data = {"error": f"SSL inspection failed: {exc}"}
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

    def run(self, domain: str, profile: str, dry_run: bool = False, verification: bool = False) -> dict[str, Any]:
        normalized_domain = domain.strip().lower()
        if not normalized_domain:
            raise ReconServiceError("Domain cannot be blank")

        is_allowed = self.is_allowed_target(normalized_domain)
        if not is_allowed:
            raise TargetNotAllowedError(f"Target domain '{normalized_domain}' is not permitted by allowlist")

        recon_summary = "Verification only: allowlist validated." if verification else "Reconnaissance completed successfully."
        result = ReconResult(
            target_domain=normalized_domain,
            is_allowed_target=is_allowed,
            dns_records={"verification": []} if verification else self.resolve_dns(normalized_domain),
            whois_data={"verification": "skipped"} if verification else self.get_whois(normalized_domain),
            ssl_certificate={"verification": "skipped"} if verification else self.inspect_ssl(normalized_domain),
            discovered_services=["verification"] if verification else self.probe_service_ports(normalized_domain),
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
