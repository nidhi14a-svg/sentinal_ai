from typing import Any


def normalize_findings(raw_findings: dict[str, Any]) -> list[dict[str, Any]]:
    """Normalize scanner-specific findings into a common format."""
    return []


def merge_scanner_logs(*logs: list[str]) -> list[str]:
    """Merge logs from multiple scanner adapters."""
    return [entry for log in logs for entry in log]
