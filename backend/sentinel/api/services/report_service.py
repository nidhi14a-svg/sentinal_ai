from typing import Any
from ..exceptions import TaskNotFoundError
from .scan_service import ScanService


class ReportService:
    """Backend report generation service skeleton."""

    def generate_report(self, task_id: str) -> dict[str, Any]:
        if task_id not in ScanService._tasks:
            raise TaskNotFoundError(f"Task {task_id} not found")
            
        ScanService._tasks[task_id]["reportReady"] = True
        
        return {
            "taskId": task_id,
            "reportUrl": f"http://localhost:8000/reports/{task_id}.pdf",
            "artifactPath": f"/app/reports/{task_id}.pdf"
        }
