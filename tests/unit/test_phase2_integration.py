import json
from pathlib import Path

from backend.sentinel.ai_analysis.services import AIAnalysisService
from backend.sentinel.reporting.services import ReportingService


FIXTURE_ROOT = Path(__file__).resolve().parents[1] / "fixtures"


def test_phase2_end_to_end_integration():
    findings = json.loads((FIXTURE_ROOT / "sample_findings_full.json").read_text(encoding="utf-8"))

    ai_service = AIAnalysisService()
    ai_result = ai_service.generate_analysis(
        target_domain="example.team-owned-site.com",
        recon_summary="Recon data indicates the targeted host is team-owned.",
        findings=findings,
    )

    report_payload = {
        "taskId": "task-5678",
        "domain": "example.team-owned-site.com",
        "scanMetadata": {"scanProfile": "full-scan", "startedAt": "2026-06-14T12:30:00Z"},
        "reconData": {"reconSummary": "Recon data indicates the targeted host is team-owned."},
        "findings": findings,
        "aiAnalysis": ai_result,
        "remediationActions": [
            {"recommendationId": ai_result["recommendations"][0]["id"], "status": "applied", "details": "Mock remediation applied."}
        ],
        "reScanResults": {"status": "re-scan-completed", "remainingFindingsCount": 0},
    }

    reporting_service = ReportingService()
    report_result = reporting_service.generate_report(report_payload)

    assert report_result["reportId"] == "report-task-5678"
    assert Path(report_result["artifactPath"]).exists()
    assert "report-task-5678" in report_result["reportUrl"]
