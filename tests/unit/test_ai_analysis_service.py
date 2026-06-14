import json
from pathlib import Path

from backend.sentinel.ai_analysis.services import AIAnalysisService


FIXTURE_ROOT = Path(__file__).resolve().parents[1] / "fixtures"
ALLOWED_TYPES = {"header_hardening", "tls_hardening", "remote_command"}


def test_generate_analysis_returns_valid_schema():
    fixture_path = FIXTURE_ROOT / "sample_findings_full.json"
    findings = json.loads(fixture_path.read_text(encoding="utf-8"))

    service = AIAnalysisService()
    result = service.generate_analysis(
        target_domain="example.team-owned-site.com",
        recon_summary="Domain validation passed.",
        findings=findings,
    )

    assert result["analysisSummary"].startswith("The scan for example.team-owned-site.com")
    assert "confidenceNotes" in result
    assert isinstance(result["recommendations"], list)
    assert len(result["recommendations"]) == len(findings)

    for recommendation in result["recommendations"]:
        assert recommendation["findingId"].startswith("f-")
        assert recommendation["id"].startswith("r-")
        assert recommendation["type"] in ALLOWED_TYPES
        assert recommendation["estimatedEffort"] in {"low", "medium"}


def test_generate_analysis_handles_empty_findings():
    service = AIAnalysisService()
    result = service.generate_analysis(
        target_domain="example.team-owned-site.com",
        recon_summary="No reconnaissance issues found.",
        findings=[],
    )

    assert result["analysisSummary"].startswith("The scan for example.team-owned-site.com returned 0 findings")
    assert result["recommendations"] == []
    assert "confidenceNotes" in result


def test_generate_analysis_normalizes_unknown_severity():
    findings = [
        {
            "findingId": "f-999",
            "title": "Unrecognized finding",
            "severity": "critical",
            "description": "An unknown severity label was supplied.",
            "source": "CustomScanner",
        }
    ]

    service = AIAnalysisService()
    result = service.generate_analysis(
        target_domain="example.team-owned-site.com",
        recon_summary="Recon summary placeholder.",
        findings=findings,
    )

    assert result["recommendations"][0]["severity"] == "medium"
    assert result["recommendations"][0]["type"] == "remote_command"
