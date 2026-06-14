import json
from pathlib import Path

from backend.sentinel.reporting.services import ReportingService


FIXTURE_ROOT = Path(__file__).resolve().parents[1] / "fixtures"


def test_generate_report_writes_html_artifact():
    report_payload = {
        "taskId": "task-1234",
        "domain": "example.team-owned-site.com",
        "scanMetadata": {"scanProfile": "full-scan", "startedAt": "2026-06-14T12:00:00Z"},
        "reconData": {"reconSummary": "Test recon summary."},
        "findings": json.loads((FIXTURE_ROOT / "sample_findings_basic.json").read_text(encoding="utf-8")),
        "aiAnalysis": {
            "analysisSummary": "A small set of issues were discovered.",
            "confidenceNotes": "High confidence from controlled target scanning.",
            "recommendations": [
                {
                    "id": "r-101",
                    "findingId": "f-101",
                    "title": "Mitigate: Missing Content-Security-Policy (CSP)",
                    "severity": "medium",
                    "description": "Add CSP header.",
                    "remediation": "Update the web server configuration.",
                    "estimatedEffort": "low",
                    "type": "header_hardening",
                }
            ],
        },
        "remediationActions": [
            {"recommendationId": "r-101", "status": "applied", "details": "Header updated."}
        ],
        "reScanResults": {"status": "re-scan-completed", "remainingFindingsCount": 0},
    }

    service = ReportingService()
    result = service.generate_report(report_payload)

    artifact_path = Path(result["artifactPath"])
    assert artifact_path.exists()
    assert artifact_path.suffix == ".html"
    assert "report-" in result["reportId"]
    assert result["reportUrl"].endswith(artifact_path.name)

    content = artifact_path.read_text(encoding="utf-8")
    assert "Forensic Report" in content
    assert "Missing Content-Security-Policy (CSP)" in content
    assert "High confidence from controlled target scanning." in content
