from dataclasses import dataclass
from typing import Any


@dataclass
class RawFinding:
    source: str
    data: dict[str, Any]


@dataclass
class NormalizedFinding:
    finding_id: str
    title: str
    severity: str
    description: str
    source: str
    remediation_hint: str
