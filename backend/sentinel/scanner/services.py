import json
import shutil
import subprocess
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any

from .configuration import ScannerConfig
from .interfaces import ScannerInterface
from .zap_adapter import ZAPAdapter
from .nikto_adapter import NiktoAdapter
from .sslyze_adapter import SslYzeAdapter
from .exceptions import (
    ScannerTargetNotAllowedError,
    ZapApiError,
    NiktoExecutionError,
    SslYzeError,
    VulnerabilityScannerUnexpectedError,
)
from ..recon.services import ReconService


def normalize_raw_findings(raw_findings: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Converts raw scanner findings into a normalized format using camelCase as per SPEC_VULNERABILITY_SCANNER."""
    normalized: list[dict[str, Any]] = []
    
    # We maintain count to generate findingId f-001, f-002, etc.
    count = 1
    
    for raw in raw_findings:
        source = raw.get("source", "unknown")
        if source == "zap":
            for alert in raw.get("alerts", []):
                # map Risk string to severity level: High -> high, Medium -> medium, Low -> low, Informational -> info
                risk = alert.get("risk", "Info").lower()
                if "high" in risk:
                    severity = "high"
                elif "medium" in risk:
                    severity = "medium"
                elif "low" in risk:
                    severity = "low"
                else:
                    severity = "info"
                    
                normalized.append(
                    {
                        "findingId": f"f-{count:03d}",
                        "title": alert.get("name", "ZAP Alert"),
                        "severity": severity,
                        "description": alert.get("description", ""),
                        "source": "ZAP",
                    }
                )
                count += 1
        elif source == "nikto":
            stdout = raw.get("stdout", "")
            for line in stdout.splitlines():
                if line.startswith("+"):
                    normalized.append(
                        {
                            "findingId": f"f-{count:03d}",
                            "title": line[1:].strip()[:80],
                            "severity": "medium",
                            "description": line[1:].strip(),
                            "source": "Nikto",
                        }
                    )
                    count += 1
        elif source == "ssl":
            # SSLyze findings
            stdout = raw.get("stdout", "")
            if stdout and "FAIL" in stdout:
                normalized.append(
                    {
                        "findingId": f"f-{count:03d}",
                        "title": "SSL/TLS Configuration Weakness",
                        "severity": "medium",
                        "description": "SSLyze scan reported configuration errors or weaknesses.",
                        "source": "SSLyze",
                    }
                )
                count += 1
            elif "error" in raw:
                normalized.append(
                    {
                        "findingId": f"f-{count:03d}",
                        "title": "SSL/TLS Inspection Failure",
                        "severity": "info",
                        "description": raw.get("error", "SSLyze scan failure"),
                        "source": "SSLyze",
                    }
                )
                count += 1
        else:
            if "error" in raw or "note" in raw:
                normalized.append(
                    {
                        "findingId": f"f-{count:03d}",
                        "title": raw.get("error") or raw.get("note") or "Unknown Scanner Output",
                        "severity": "info",
                        "description": "No normalized mapping available.",
                        "source": source.upper() if isinstance(source, str) else "UNKNOWN",
                    }
                )
                count += 1
    return normalized


def execute_scan(domain: str, scan_profile: str, recon_data: dict[str, Any]) -> dict[str, Any]:
    """Module-level execute_scan function delegating to ScannerService."""
    return ScannerService().execute_scan(domain, scan_profile, recon_data)


class ScannerService(ScannerInterface):
    """Scanner orchestration service implementation."""

    def __init__(self, config: ScannerConfig | None = None) -> None:
        self.config = config or ScannerConfig()
        self.output_directory = Path(__file__).resolve().parent / "output"
        self.output_directory.mkdir(parents=True, exist_ok=True)
        self.recon_service = ReconService()

    def run_zap_scan(self, domain: str) -> dict[str, Any]:
        adapter = ZAPAdapter(self.config.zap_api_url, self.config.scan_timeout_seconds)
        return adapter.run(domain)

    def run_nikto_scan(self, domain: str) -> dict[str, Any]:
        adapter = NiktoAdapter(self.config.nikto_path, self.config.scan_timeout_seconds)
        return adapter.run(domain)

    def run_ssl_scan(self, domain: str) -> dict[str, Any]:
        adapter = SslYzeAdapter(self.config.scan_timeout_seconds)
        return adapter.run(domain)

    def normalize_findings(self, raw_findings: list[dict[str, Any]]) -> list[dict[str, Any]]:
        # Backward-compatible normalizer returning snake_case finding_id and remediation_hint
        normalized: list[dict[str, Any]] = []
        for idx, item in enumerate(normalize_raw_findings(raw_findings), start=1):
            normalized.append(
                {
                    "finding_id": f"{item['source'].lower()}-{idx}",
                    "title": item["title"],
                    "severity": item["severity"].capitalize(),
                    "description": item["description"],
                    "source": item["source"],
                    "remediation_hint": f"Review {item['source']} finding and apply configuration updates.",
                }
            )
        return normalized

    def write_json_output(self, data: dict[str, Any]) -> str:
        filename = self.output_directory / f"scanner_output_{datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}.json"
        with open(filename, "w", encoding="utf-8") as handle:
            json.dump(data, handle, indent=2)
        return str(filename)

    def execute_scan(self, domain: str, scan_profile: str, recon_data: dict[str, Any]) -> dict[str, Any]:
        """Runs the vulnerability scanning process and returns camelCase spec-compliant output."""
        target = domain.strip().lower()
        
        # Verify domain is allowed
        try:
            if not self.recon_service.is_allowed_target(target):
                raise ScannerTargetNotAllowedError(f"Target '{target}' not allowed by target scope allowlist")
        except Exception as exc:
            if isinstance(exc, ScannerTargetNotAllowedError):
                raise exc
            raise ScannerTargetNotAllowedError(f"Could not validate target allowlist: {exc}")

        scan_id = f"scan-{uuid.uuid4()}"
        scanner_logs: list[str] = ["Scanning target initialized."]
        raw_findings: dict[str, list[dict[str, Any]]] = {"zap": [], "nikto": [], "ssl": []}

        # Run ZAP scan
        try:
            scanner_logs.append("zap scan started")
            zap_res = self.run_zap_scan(target)
            raw_findings["zap"].append(zap_res)
            scanner_logs.append("zap scan completed")
        except Exception as exc:
            scanner_logs.append(f"zap scan failed: {exc}")
            raw_findings["zap"].append({"source": "zap", "error": str(exc)})

        # Run Nikto scan
        try:
            scanner_logs.append("nikto scan started")
            nikto_res = self.run_nikto_scan(target)
            raw_findings["nikto"].append(nikto_res)
            scanner_logs.append("nikto scan completed")
        except Exception as exc:
            scanner_logs.append(f"nikto scan failed: {exc}")
            raw_findings["nikto"].append({"source": "nikto", "error": str(exc)})

        # Run SSL scan
        try:
            scanner_logs.append("sslyze scan started")
            ssl_res = self.run_ssl_scan(target)
            raw_findings["ssl"].append(ssl_res)
            scanner_logs.append("sslyze scan completed")
        except Exception as exc:
            scanner_logs.append(f"sslyze scan failed: {exc}")
            raw_findings["ssl"].append({"source": "ssl", "error": str(exc)})

        # Aggregate raw findings into flat list for normalizer
        flat_raw: list[dict[str, Any]] = []
        for val in raw_findings.values():
            flat_raw.extend(val)

        normalized = normalize_raw_findings(flat_raw)
        completed_at = datetime.utcnow().isoformat() + "Z"

        return {
            "scanId": scan_id,
            "domain": target,
            "scanProfile": scan_profile,
            "rawFindings": raw_findings,
            "normalizedFindings": normalized,
            "scannerLogs": scanner_logs,
            "completedAt": completed_at,
        }

    def execute(
        self,
        domain: str,
        profile: str,
        metadata: dict[str, Any],
        dry_run: bool = False,
        verification: bool = False,
    ) -> dict[str, Any]:
        target = domain.strip().lower()
        scan_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat() + "Z"
        scanner_logs: list[dict[str, Any]] = []
        raw_findings: list[dict[str, Any]] = []

        # Enforce allowlist check (even for execute)
        try:
            if not self.recon_service.is_allowed_target(target):
                raise ScannerTargetNotAllowedError(f"Target '{target}' not allowed by allowlist")
        except Exception as exc:
            if isinstance(exc, ScannerTargetNotAllowedError):
                raise exc
            raise ScannerTargetNotAllowedError(f"Could not validate target allowlist: {exc}")

        if verification:
            scanner_logs.append({"level": "info", "message": "Verification mode enabled. Scanners will not execute."})
            raw_findings = [
                {"source": "zap", "note": "ZAP scan would run against the target."},
                {"source": "nikto", "note": "Nikto scan would run against the target."},
                {"source": "ssl", "note": "SSLyze scan would run against the target."},
            ]
        elif dry_run:
            scanner_logs.append({"level": "info", "message": "Dry-run mode enabled. Scanner commands will be logged but not executed."})
            raw_findings = [
                {"source": "zap", "command": f"{self.config.zap_api_url}/JSON/ascan/action/scan/?url=http://{target}&recurse=true"},
                {"source": "nikto", "command": f"{self.config.nikto_path} -host http://{target}"},
                {"source": "ssl", "command": f"sslyze --regular {target}:443"},
            ]
        else:
            scanner_logs.append({"level": "info", "message": "Starting ZAP scan."})
            try:
                zap_output = self.run_zap_scan(target)
                raw_findings.append(zap_output)
            except Exception as exc:
                raw_findings.append({"source": "zap", "error": str(exc)})
            
            scanner_logs.append({"level": "info", "message": "Starting Nikto scan."})
            try:
                nikto_output = self.run_nikto_scan(target)
                raw_findings.append(nikto_output)
            except Exception as exc:
                raw_findings.append({"source": "nikto", "error": str(exc)})

            scanner_logs.append({"level": "info", "message": "Starting SSL scan."})
            try:
                ssl_output = self.run_ssl_scan(target)
                raw_findings.append(ssl_output)
            except Exception as exc:
                raw_findings.append({"source": "ssl", "error": str(exc)})

        normalized = self.normalize_findings(raw_findings)
        result = {
            "scan_id": scan_id,
            "domain": target,
            "scan_profile": profile,
            "metadata": metadata,
            "raw_findings": raw_findings,
            "normalized_findings": normalized,
            "scanner_logs": scanner_logs,
            "completed_at": timestamp,
            "dry_run": dry_run,
            "verification": verification,
        }

        # Keep camelCase versions for compatibility with clients expecting it
        result["scanId"] = scan_id
        result["scanProfile"] = profile
        result["rawFindings"] = {
            "zap": [f for f in raw_findings if f.get("source") == "zap"],
            "nikto": [f for f in raw_findings if f.get("source") == "nikto"],
            "ssl": [f for f in raw_findings if f.get("source") == "ssl"],
        }
        result["normalizedFindings"] = normalize_raw_findings(raw_findings)
        result["scannerLogs"] = [
            l.get("message", "") if isinstance(l, dict) else str(l) for l in scanner_logs
        ]
        result["completedAt"] = timestamp

        if not dry_run and not verification:
            result["output_file"] = self.write_json_output(result)
            scanner_logs.append({"level": "info", "message": f"Scanner output written to {result['output_file']}"})

        return result
