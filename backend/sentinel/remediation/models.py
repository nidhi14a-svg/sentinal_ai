from dataclasses import dataclass
from typing import Any


@dataclass
class RemediationAction:
    recommendation_id: str
    finding_id: str
    status: str
    details: str


@dataclass
class RemediationResult:
    remediation_status: str
    remediation_actions: list[RemediationAction]
    audit_trail: list[dict[str, Any]]
    completed_at: str
