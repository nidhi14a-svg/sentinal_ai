from pathlib import Path

from backend.sentinel.recon.configuration import ReconConfig
from backend.sentinel.recon.exceptions import TargetNotAllowedError
from backend.sentinel.recon.services import ReconService


def test_is_allowed_target(tmp_path):
    allowlist = tmp_path / "allowlist.txt"
    allowlist.write_text("example.com\n")
    service = ReconService(ReconConfig(allowlist_file=str(allowlist)))

    assert service.is_allowed_target("example.com")
    assert not service.is_allowed_target("bad-example.com")


def test_run_disallowed_target_raises(tmp_path):
    allowlist = tmp_path / "allowlist.txt"
    allowlist.write_text("example.com\n")
    service = ReconService(ReconConfig(allowlist_file=str(allowlist)))

    try:
        service.run("bad-example.com", "quick")
        assert False, "TargetNotAllowedError should be raised"
    except TargetNotAllowedError:
        assert True


def test_run_dry_run_returns_planned_steps(monkeypatch, tmp_path):
    allowlist = tmp_path / "allowlist.txt"
    allowlist.write_text("example.com\n")
    service = ReconService(ReconConfig(allowlist_file=str(allowlist)))

    monkeypatch.setattr(service, "resolve_dns", lambda domain: {"A": ["127.0.0.1"]})
    monkeypatch.setattr(service, "get_whois", lambda domain: {"domain_name": "example.com"})
    monkeypatch.setattr(service, "inspect_ssl", lambda domain: {"subject": []})
    monkeypatch.setattr(service, "probe_service_ports", lambda domain: ["http"])

    result = service.run("example.com", "quick", dry_run=True)

    assert result["dry_run"] is True
    assert "planned_steps" in result
    assert result["dns_records"]["A"] == ["127.0.0.1"]
    assert result["recon_summary"].startswith("Reconnaissance")


def test_run_verification_returns_skipped_fields(monkeypatch, tmp_path):
    allowlist = tmp_path / "allowlist.txt"
    allowlist.write_text("example.com\n")
    service = ReconService(ReconConfig(allowlist_file=str(allowlist)))

    result = service.run("example.com", "quick", verification=True)

    assert result["verification"] is True
    assert result["dns_records"] == {"verification": []}
    assert result["whois_data"] == {"verification": "skipped"}
    assert result["ssl_certificate"] == {"verification": "skipped"}
