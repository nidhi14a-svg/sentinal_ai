from dataclasses import dataclass


@dataclass
class ReconConfig:
    allowlist_file: str = "/app/sample_target/allowlist.txt"
    dns_timeout_seconds: int = 10
    whois_timeout_seconds: int = 15
