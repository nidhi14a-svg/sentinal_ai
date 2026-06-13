from typing import Any


class ReportService:
    """Backend report generation service skeleton."""

    def generate_report(self, task_id: str) -> dict[str, Any]:
        return {
            "taskId": task_id,
            "reportUrl": f"http://localhost:8000/reports/{task_id}.pdf",
            "artifactPath": f"/app/reports/{task_id}.pdf"
        }
