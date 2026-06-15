import json
import os
from datetime import datetime
from pathlib import Path
from typing import Any
from .interfaces import ReportingInterface


REQUIRED_PAYLOAD_KEYS = {
    "taskId",
    "domain",
    "scanMetadata",
    "reconData",
    "findings",
    "aiAnalysis",
    "remediationActions",
    "reScanResults",
}


class ReportingService(ReportingInterface):
    """Reporting service implementation for Phase 2 forensic report generation."""

    def generate_report(self, report_payload: dict[str, Any]) -> dict[str, Any]:
        """Render a forensic report artifact from the report payload."""
        missing = REQUIRED_PAYLOAD_KEYS - report_payload.keys()
        if missing:
            raise ValueError(f"Missing required report payload keys: {sorted(missing)}")

        task_id = str(report_payload["taskId"])
        domain = str(report_payload["domain"])
        scan_metadata = report_payload["scanMetadata"] or {}
        findings = report_payload["findings"] or []
        ai_analysis = report_payload["aiAnalysis"] or {}
        remediation_actions = report_payload["remediationActions"] or []
        re_scan_results = report_payload["reScanResults"] or {}

        reports_dir = Path(os.getenv("REPORTS_PATH", Path(__file__).resolve().parents[3] / "reports"))
        reports_dir.mkdir(parents=True, exist_ok=True)

        report_name = f"report-{task_id}.html"  # pyrefly: ignore
        report_path = reports_dir / report_name  # pyrefly: ignore
        report_url_prefix = os.getenv("REPORTS_URL_PREFIX", "http://localhost:8000/reports").rstrip("/")  # pyrefly: ignore
        report_url = f"{report_url_prefix}/{report_name}"  # pyrefly: ignore

        html = self._render_report_html(
            task_id=task_id,
            domain=domain,
            scan_metadata=scan_metadata,
            recon_data=report_payload["reconData"],
            findings=findings,
            ai_analysis=ai_analysis,
            remediation_actions=remediation_actions,
            re_scan_results=re_scan_results,
            report_payload=report_payload,
        )

        report_path.write_text(html, encoding="utf-8")
        # Attempt to render PDF if WeasyPrint is available
        pdf_path = None
        try:
          # pyrefly: ignore [missing-import]
          from weasyprint import HTML

          pdf_name = f"report-{task_id}.pdf"  # pyrefly: ignore
          pdf_path = reports_dir / pdf_name  # pyrefly: ignore
          HTML(string=html).write_pdf(str(pdf_path))  # pyrefly: ignore
          report_url = f"{report_url_prefix}/{pdf_name}"  # pyrefly: ignore
          artifact_path = str(pdf_path.resolve())  # pyrefly: ignore
        except Exception:
          # WeasyPrint not available or PDF rendering failed — fall back to HTML
          artifact_path = str(report_path.resolve())

        return {
          "reportId": f"report-{task_id}",
          "reportUrl": report_url,
          "artifactPath": artifact_path,
          "generatedAt": datetime.utcnow().isoformat() + "Z",
          "reportSummary": f"Forensic report for {domain} generated successfully.",
        }

    def _render_report_html(
        self,
        task_id: str,
        domain: str,
        scan_metadata: dict[str, Any],
        recon_data: dict[str, Any],
        findings: list[dict[str, Any]],
        ai_analysis: dict[str, Any],
        remediation_actions: list[dict[str, Any]],
        re_scan_results: dict[str, Any],
        report_payload: dict[str, Any],
    ) -> str:
        header = (
            f"<h1>Forensic Report</h1>"
            f"<p><strong>Task:</strong> {task_id}</p>"
            f"<p><strong>Domain:</strong> {domain}</p>"
            f"<p><strong>Scan Profile:</strong> {scan_metadata.get('scanProfile', 'unknown')}</p>"
            f"<p><strong>Started At:</strong> {scan_metadata.get('startedAt', '')}</p>"
        )

        findings_html = "".join(
            f"<li><strong>{finding.get('title')}</strong> ({finding.get('severity')}) - {finding.get('description')}</li>"
            for finding in findings
        ) or "<li>No findings detected.</li>"

        recommendations = ai_analysis.get("recommendations", [])
        recommendations_html = "".join(
            f"<li><strong>{rec.get('title')}</strong> [{rec.get('type')}]<br/>"
            f"Severity: {rec.get('severity')}<br/>Remediation: {rec.get('remediation')}<br/>"
            f"Estimated Effort: {rec.get('estimatedEffort')}</li>"
            for rec in recommendations
        ) or "<li>No recommendations available.</li>"

        remediation_html = "".join(
            f"<li><strong>{action.get('recommendationId')}</strong> - {action.get('status')} - {action.get('details', '')}</li>"
            for action in remediation_actions
        ) or "<li>No remediation actions recorded.</li>"

        html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Forensic Report - {task_id}</title>
  <style>
    body {{ font-family: Arial, sans-serif; line-height: 1.5; margin: 24px; }}
    h1, h2, h3 {{ color: #2c3e50; }}
    section {{ margin-bottom: 24px; }}
    ul {{ margin-left: 20px; }}
    pre {{ background: #f4f4f4; padding: 12px; overflow-x: auto; }}
  </style>
</head>
<body>
  {header}
  <section>
    <h2>AI Analysis Summary</h2>
    <p>{ai_analysis.get('analysisSummary', 'No summary available.')}</p>
    <p><strong>Confidence Notes:</strong> {ai_analysis.get('confidenceNotes', 'N/A')}</p>
  </section>
  <section>
    <h2>Findings</h2>
    <ul>{findings_html}</ul>
  </section>
  <section>
    <h2>Recommendations</h2>
    <ul>{recommendations_html}</ul>
  </section>
  <section>
    <h2>Remediation Actions</h2>
    <ul>{remediation_html}</ul>
  </section>
  <section>
    <h2>Re-scan Results</h2>
    <p>Status: {re_scan_results.get('status', 'unknown')}</p>
    <p>Remaining Findings Count: {re_scan_results.get('remainingFindingsCount', 0)}</p>
  </section>
  <section>
    <h2>Raw Payload</h2>
    <pre>{json.dumps(report_payload, indent=2)}</pre>
  </section>
</body>
</html>
"""
        return html
