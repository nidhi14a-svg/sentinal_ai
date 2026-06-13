from backend.sentinel.scanner.configuration import ScannerConfig
from backend.sentinel.scanner.services import ScannerService


def test_execute_dry_run_returns_commands(monkeypatch):
    service = ScannerService(ScannerConfig(nikto_path="nikto"))
    result = service.execute("example.com", "quick", {"initiated_by": "person_a"}, dry_run=True)

    assert result["dry_run"] is True
    assert result["verification"] is False
    assert any("nikto" in raw.get("command", "") for raw in result["raw_findings"])
    assert any(raw.get("source") == "zap" for raw in result["raw_findings"])


def test_execute_verification_skips_scans():
    service = ScannerService(ScannerConfig())
    result = service.execute("example.com", "quick", {"initiated_by": "person_a"}, verification=True)

    assert result["verification"] is True
    assert result["dry_run"] is False
    assert result["raw_findings"][0]["source"] == "zap"
    assert result["raw_findings"][1]["source"] == "nikto"


def test_normalize_findings_from_raw_data():
    service = ScannerService(ScannerConfig())
    input_data = [
        {
            "source": "zap",
            "alerts": [
                {
                    "name": "XSS vulnerability",
                    "risk": "High",
                    "description": "Reflected XSS found.",
                    "solution": "Sanitize input.",
                }
            ],
        },
        {
            "source": "nikto",
            "stdout": "+ Example issue description\n",
        },
    ]
    normalized = service.normalize_findings(input_data)

    assert len(normalized) == 2
    assert normalized[0]["severity"] == "High"
    assert normalized[1]["source"] == "Nikto"
