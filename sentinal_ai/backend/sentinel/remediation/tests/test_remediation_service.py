from pathlib import Path

from backend.sentinel.remediation.configuration import RemediationConfig
from backend.sentinel.remediation.services import RemediationService


def test_execute_dry_run_records_actions(monkeypatch, tmp_path):
    config_path = tmp_path / "nginx.conf"
    config_path.write_text("server { listen 80; }\n", encoding="utf-8")
    audit_path = tmp_path / "audit.log"
    service = RemediationService(RemediationConfig(audit_log_path=str(audit_path)))
    monkeypatch.setattr(service, "_local_nginx_config_path", lambda: config_path)

    recommendations = [
        {"title": "Add security headers", "type": "header_hardening"},
    ]
    result = service.execute("task-1", "apply", recommendations, dry_run=True)

    assert result["dry_run"] is True
    assert result["remediation_status"] == "completed"
    assert result["remediation_actions"][0]["status"] == "dry_run"
    assert audit_path.exists()


def test_execute_verification_only(monkeypatch, tmp_path):
    audit_path = tmp_path / "audit.log"
    service = RemediationService(RemediationConfig(audit_log_path=str(audit_path)))

    recommendations = [{"title": "Validate TLS settings", "type": "tls_hardening"}]
    result = service.execute("task-2", "apply", recommendations, verification=True)

    assert result["verification"] is True
    assert result["remediation_status"] == "verification_only"
    assert result["remediation_actions"][0]["status"] == "verification"
    assert audit_path.exists()
