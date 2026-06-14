import pytest
from backend.sentinel.recon.exceptions import (
    DnsLookupError,
    WhoisLookupError,
    SslInspectionError,
    DomainReconUnexpectedError,
    InvalidDomainError,
    TargetNotAllowedError,
)
from backend.sentinel.recon.services import verify_allowed_domain, build_recon_payload, run_recon, ReconService
from backend.sentinel.recon.utilities import parse_dns_records, build_recon_summary


def test_verify_allowed_domain():
    allowlist = {"example.com", "TEST.SITE.COM"}
    assert verify_allowed_domain("example.com", allowlist) is True
    assert verify_allowed_domain("test.site.com", allowlist) is True
    assert verify_allowed_domain("other.com", allowlist) is False


def test_parse_dns_records():
    assert parse_dns_records(None) == {}
    assert parse_dns_records("not a dict") == {}
    raw = {"A": ["1.1.1.1 "], "MX": [" 10 mail.example.com"]}
    parsed = parse_dns_records(raw)
    assert parsed["A"] == ["1.1.1.1"]
    assert parsed["MX"] == ["10 mail.example.com"]


def test_build_recon_summary():
    data = {
        "targetDomain": "test.com",
        "dnsRecords": {"A": ["127.0.0.1"]},
        "sslCertificate": {"issuer": [("commonName", "test-issuer")]}
    }
    summary = build_recon_summary(data)
    assert "test.com" in summary
    assert "127.0.0.1" in summary


def test_build_recon_payload():
    raw_data = {
        "target_domain": "foo.com",
        "is_allowed_target": True,
        "dns_records": {"A": ["192.168.1.1"]},
        "whois_data": {"registrar": "test registrar"},
        "ssl_certificate": {"issuer": "test issuer"},
        "discovered_services": ["http", "https"],
        "timestamp": "2026-06-13T12:00:00Z"
    }
    payload = build_recon_payload(raw_data)
    assert payload["targetDomain"] == "foo.com"
    assert payload["isAllowedTarget"] is True
    assert payload["dnsRecords"] == {"A": ["192.168.1.1"]}
    assert payload["whoisData"]["registrar"] == "test registrar"
    assert payload["sslCertificate"]["issuer"] == "test issuer"
    assert payload["discoveredServices"] == ["http", "https"]
    assert "Reconnaissance completed" in payload["reconSummary"]
    assert payload["timestamp"] == "2026-06-13T12:00:00Z"


def test_run_recon_failure_handling(monkeypatch, tmp_path):
    allowlist = tmp_path / "allowlist.txt"
    allowlist.write_text("example.com\n")
    service = ReconService(config=None)
    monkeypatch.setattr(service, "load_allowlist", lambda: {"example.com"})

    # Target not allowed raises TargetNotAllowedError
    with pytest.raises(TargetNotAllowedError):
        service.run_recon("disallowed.com", "quick")

    # Invalid domain raises InvalidDomainError
    with pytest.raises(InvalidDomainError):
        service.run_recon("example", "quick")
