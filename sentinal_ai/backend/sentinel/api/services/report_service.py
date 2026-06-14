from typing import Any
from ..exceptions import TaskNotFoundError
from .scan_service import ScanService
from ...reporting.services import ReportingService


class ReportService:
    """Backend report generation service."""

    def generate_report(self, task_id: str) -> dict[str, Any]:
        """Generate a final forensic report, incorporating scanner and remediation results."""
        if task_id not in ScanService._tasks:
            raise TaskNotFoundError(f"Task {task_id} not found")
            
        task = ScanService._tasks[task_id]
        
        # Prepare reScanResults depending on remediation actions applied
        remediation_actions = task.get("remediationActions") or []
        applied_rec_ids = {act.get("recommendationId") for act in remediation_actions if act.get("status") == "applied"}
        
        remaining_findings = [
            f for f in task.get("findings") or []
            if f.get("recommendationId") not in applied_rec_ids
        ]
        
        report_payload = {
            "taskId": task_id,
            "domain": task.get("domain") or "unknown-domain",
            "scanMetadata": {
                "scanProfile": task.get("scanProfile") or "full-scan",
                "startedAt": task.get("startedAt", "")
            },
            "reconData": task.get("reconData") or {},
            "findings": task.get("findings") or [],
            "aiAnalysis": task.get("aiAnalysis") or {},
            "remediationActions": remediation_actions,
            "reScanResults": {
                "status": "re-scan-completed" if remediation_actions else "no-remediation-triggered",
                "remainingFindingsCount": len(remaining_findings)
            }
        }
        
        # Call the reporting module method
        reporting_service = ReportingService()
        rep_res = reporting_service.generate_report(report_payload)
        
        # Persist reportReady status in task
        task["reportReady"] = True
        
        return {
            "taskId": task_id,
            "reportUrl": rep_res["reportUrl"],
            "artifactPath": rep_res["artifactPath"]
        }
