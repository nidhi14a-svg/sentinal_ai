from dataclasses import dataclass


@dataclass
class RemediationConfig:
    ssh_timeout_seconds: int = 30
    max_retries: int = 3
    audit_log_path: str = "backend/sentinel/remediation/audit.log"
