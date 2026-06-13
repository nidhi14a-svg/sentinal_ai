from dataclasses import dataclass


@dataclass
class ScannerConfig:
    zap_api_url: str = "http://localhost:8080"
    nikto_path: str = "/usr/bin/nikto"
    scan_timeout_seconds: int = 120
