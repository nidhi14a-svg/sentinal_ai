import os
from datetime import datetime
from pathlib import Path
from typing import Any
from .interfaces import ReportingInterface


class ReportingService(ReportingInterface):
    """Mock/conforming reporting service implementation for Person B's module."""

    def generate_report(self, report_payload: dict[str, Any]) -> dict[str, Any]:
        """Accepts a full report payload and returns the report artifact references."""
        task_id = report_payload.get("taskId") or "task-0000"
        domain = report_payload.get("domain") or "unknown-domain"
        findings = report_payload.get("findings") or []
        
        # Ensure we have a unique report ID
        report_id = f"report-{task_id.split('-')[-1]}"
        
        # Resolve artifact path locally in workspace for verification, or use spec path
        reports_dir = Path(__file__).resolve().parents[3] / "reports"
        reports_dir.mkdir(parents=True, exist_ok=True)
        pdf_path = reports_dir / f"{report_id}.pdf"
        
        # Write a dummy mock PDF file to the storage path
        try:
            with open(pdf_path, "w", encoding="utf-8") as f:
                f.write(f"%PDF-1.4 mock report for {domain}\n")
                f.write(f"Task ID: {task_id}\n")
                f.write(f"Findings: {len(findings)}\n")
        except Exception:
            pass # ignore write issues in restricted read-only environments
            
        generated_at = datetime.utcnow().isoformat() + "Z"
        
        return {
            "reportId": report_id,
            "reportUrl": f"http://localhost:8000/reports/{report_id}.pdf",
            "artifactPath": str(pdf_path.resolve()),
            "generatedAt": generated_at,
            "reportSummary": f"Forensic report generated for {domain}, including remediation validation.",
        }
