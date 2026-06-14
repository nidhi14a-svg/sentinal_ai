from typing import Any


def validate_recommendations(recommendations: list[dict[str, Any]]) -> bool:
    """Validate remediation recommendation payloads."""
    return bool(recommendations)


def build_audit_entry(task_id: str, recommendation: dict[str, Any], status: str) -> dict[str, Any]:
    """Create an audit trail entry for remediation execution."""
    return {
        "task_id": task_id,
        "recommendation_id": recommendation.get("id", ""),
        "status": status,
        "details": ""
    }
