from typing import Any


class RemediationInterface:
    """Defines remediation contract."""

    def execute(
        self,
        task_id: str,
        action: str,
        recommendations: list[dict[str, Any]],
        target_host: str | None = None,
        dry_run: bool = False,
        verification: bool = False,
    ) -> dict[str, Any]:
        raise NotImplementedError


class AuditLoggerInterface:
    """Tracking and audit contract."""

    def record(self, entry: dict[str, Any]) -> None:
        raise NotImplementedError
