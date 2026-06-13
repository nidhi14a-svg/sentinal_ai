import json
import shutil
import subprocess
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any

import requests

from .configuration import ScannerConfig
from .interfaces import ScannerInterface
from .models import NormalizedFinding, RawFinding


class ScannerService(ScannerInterface):
    """Scanner orchestration service implementation."""

    def __init__(self, config: ScannerConfig | None = None) -> None:
        self.config = config or ScannerConfig()
        self.output_directory = Path(__file__).resolve().parent / "output"
        self.output_directory.mkdir(parents=True, exist_ok=True)

    def run_zap_scan(self, domain: str) -> dict[str, Any]:
        raw: dict[str, Any] = {"source": "zap", "alerts": []}
        try:
            scan_url = f"{self.config.zap_api_url}/JSON/ascan/action/scan/?url=http://{domain}&recurse=true"
            response = requests.get(scan_url, timeout=20)
            response.raise_for_status()
            scan_id = response.json().get("scan")
            raw["scan_id"] = scan_id
            status_url = f"{self.config.zap_api_url}/JSON/ascan/view/status/?scanId={scan_id}"
            elapsed = 0
            while elapsed < self.config.scan_timeout_seconds:
                status_resp = requests.get(status_url, timeout=20)
                status_resp.raise_for_status()
                status = int(status_resp.json().get("status", 0))
                if status >= 100:
                    break
                elapsed += 5
            alerts_url = f"{self.config.zap_api_url}/JSON/core/view/alerts/?baseurl=http://{domain}"
            alerts_resp = requests.get(alerts_url, timeout=20)
            alerts_resp.raise_for_status()
            raw["alerts"] = alerts_resp.json().get("alerts", [])
        except requests.RequestException as exc:
            raw["error"] = f"ZAP request failed: {exc}"
        except Exception as exc:
            raw["error"] = f"ZAP scan failed: {exc}"
        return raw

    def run_nikto_scan(self, domain: str) -> dict[str, Any]:
        raw: dict[str, Any] = {"source": "nikto"}
        if not shutil.which(self.config.nikto_path):
            raw["error"] = f"Nikto binary not found at '{self.config.nikto_path}'"
            return raw

        command = [self.config.nikto_path, "-host", f"http://{domain}"]
        try:
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                timeout=self.config.scan_timeout_seconds,
                check=False,
            )
            raw.update(
                {
                    "command": " ".join(command),
                    "exit_code": result.returncode,
                    "stdout": result.stdout.strip(),
                    "stderr": result.stderr.strip(),
                }
            )
        except subprocess.TimeoutExpired as exc:
            raw["error"] = f"Nikto timed out: {exc}"
        except Exception as exc:
            raw["error"] = f"Nikto execution failed: {exc}"
        return raw

    def normalize_findings(self, raw_findings: list[dict[str, Any]]) -> list[dict[str, Any]]:
        normalized: list[dict[str, Any]] = []
        for raw in raw_findings:
            source = raw.get("source", "unknown")
            if source == "zap":
                for idx, alert in enumerate(raw.get("alerts", []), start=1):
                    normalized.append(
                        {
                            "finding_id": f"zap-{idx}",
                            "title": alert.get("name", "ZAP Alert"),
                            "severity": alert.get("risk", "Info"),
                            "description": alert.get("description", ""),
                            "source": "ZAP",
                            "remediation_hint": alert.get("solution", "Review ZAP alert details."),
                        }
                    )
            elif source == "nikto":
                stdout = raw.get("stdout", "")
                for line in stdout.splitlines():
                    if line.startswith("+"):
                        normalized.append(
                            {
                                "finding_id": f"nikto-{len(normalized) + 1}",
                                "title": line[1:].strip()[:80],
                                "severity": "Medium",
                                "description": line[1:].strip(),
                                "source": "Nikto",
                                "remediation_hint": "Review the Nikto finding and address web server misconfiguration.",
                            }
                        )
            else:
                normalized.append(
                    {
                        "finding_id": f"unknown-{len(normalized) + 1}",
                        "title": raw.get("error", "Unknown scanner output"),
                        "severity": "Info",
                        "description": "No normalized mapping available.",
                        "source": source,
                        "remediation_hint": "Investigate scanner output manually.",
                    }
                )
        return normalized

    def write_json_output(self, data: dict[str, Any]) -> str:
        filename = self.output_directory / f"scanner_output_{datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}.json"
        with open(filename, "w", encoding="utf-8") as handle:
            json.dump(data, handle, indent=2)
        return str(filename)

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

        if verification:
            scanner_logs.append({"level": "info", "message": "Verification mode enabled. Scanners will not execute."})
            raw_findings = [
                {"source": "zap", "note": "ZAP scan would run against the target."},
                {"source": "nikto", "note": "Nikto scan would run against the target."},
            ]
        elif dry_run:
            scanner_logs.append({"level": "info", "message": "Dry-run mode enabled. Scanner commands will be logged but not executed."})
            raw_findings = [
                {"source": "zap", "command": f"{self.config.zap_api_url}/JSON/ascan/action/scan/?url=http://{target}&recurse=true"},
                {"source": "nikto", "command": f"{self.config.nikto_path} -host http://{target}"},
            ]
        else:
            scanner_logs.append({"level": "info", "message": "Starting ZAP scan."})
            zap_output = self.run_zap_scan(target)
            raw_findings.append(zap_output)
            scanner_logs.append({"level": "info", "message": "Starting Nikto scan."})
            nikto_output = self.run_nikto_scan(target)
            raw_findings.append(nikto_output)

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

        if not dry_run and not verification:
            result["output_file"] = self.write_json_output(result)
            scanner_logs.append({"level": "info", "message": f"Scanner output written to {result['output_file']}"})

        return result
