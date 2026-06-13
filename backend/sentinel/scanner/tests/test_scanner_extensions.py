import pytest
from unittest.mock import MagicMock
from backend.sentinel.scanner.exceptions import (
    ScannerTargetNotAllowedError,
    ZapApiError,
    NiktoExecutionError,
    SslYzeError,
)
from backend.sentinel.scanner.zap_adapter import ZAPAdapter
from backend.sentinel.scanner.nikto_adapter import NiktoAdapter
from backend.sentinel.scanner.sslyze_adapter import SslYzeAdapter
from backend.sentinel.scanner.services import (
    normalize_raw_findings,
    execute_scan,
    ScannerService,
)
from backend.sentinel.scanner.configuration import ScannerConfig


def test_normalize_raw_findings():
    raw_findings = [
        {
            "source": "zap",
            "alerts": [
                {"name": "SQL Injection", "risk": "High", "description": "SQL injection vulnerability detected."},
                {"name": "X-Frame-Options Header Not Set", "risk": "Medium", "description": "Clickjacking risk."}
            ]
        },
        {
            "source": "nikto",
            "stdout": "+ OSVDB-3092: /cgi-bin/test.cgi: Test CGI exists\n"
        },
        {
            "source": "ssl",
            "stdout": "FAIL: Weak TLS 1.0 supported"
        }
    ]
    normalized = normalize_raw_findings(raw_findings)
    assert len(normalized) == 4
    
    assert normalized[0]["title"] == "SQL Injection"
    assert normalized[0]["severity"] == "high"
    assert normalized[0]["source"] == "ZAP"
    
    assert normalized[1]["title"] == "X-Frame-Options Header Not Set"
    assert normalized[1]["severity"] == "medium"
    assert normalized[1]["source"] == "ZAP"
    
    assert "OSVDB-3092" in normalized[2]["title"]
    assert normalized[2]["severity"] == "medium"
    assert normalized[2]["source"] == "Nikto"

    assert normalized[3]["title"] == "SSL/TLS Configuration Weakness"
    assert normalized[3]["severity"] == "medium"
    assert normalized[3]["source"] == "SSLyze"


def test_zap_adapter_requests_failure(monkeypatch):
    adapter = ZAPAdapter(zap_api_url="http://mocked-zap:8080")
    
    # Mock requests.get to throw requests.RequestException
    import requests
    def mock_get(*args, **kwargs):
        raise requests.RequestException("connection failed")
    monkeypatch.setattr(requests, "get", mock_get)

    with pytest.raises(ZapApiError) as exc_info:
        adapter.run("example.com")
    assert exc_info.value.retryable is True


def test_nikto_adapter_missing_binary(monkeypatch):
    adapter = NiktoAdapter(nikto_path="/invalid/path/nikto")
    monkeypatch.setattr("shutil.which", lambda p: False)
    
    with pytest.raises(NiktoExecutionError):
        adapter.run("example.com")


def test_sslyze_adapter_missing_binary(monkeypatch):
    adapter = SslYzeAdapter()
    monkeypatch.setattr("shutil.which", lambda p: False)
    
    with pytest.raises(SslYzeError):
        adapter.run("example.com")


def test_execute_scan_unauthorized_target(monkeypatch):
    service = ScannerService()
    # Mock recon target validation to return False
    monkeypatch.setattr(service.recon_service, "is_allowed_target", lambda domain: False)

    with pytest.raises(ScannerTargetNotAllowedError):
        service.execute_scan("bad-target.com", "full-scan", {})
