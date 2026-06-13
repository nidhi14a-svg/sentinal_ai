from dataclasses import dataclass
from typing import Any


@dataclass
class ReconResult:
    target_domain: str
    is_allowed_target: bool
    dns_records: dict[str, list[str]]
    whois_data: dict[str, Any]
    ssl_certificate: dict[str, Any]
    discovered_services: list[str]
    recon_summary: str
    timestamp: str


@dataclass
class TargetMetadata:
    domain: str
    allowlist_id: str
    scan_profile: str
