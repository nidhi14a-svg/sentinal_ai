import pytest
from backend.sentinel.remediation.exceptions import (
    RemediationApprovalError,
    RemediationTargetNotAllowedError,
    UnsupportedRemediationError,
)
from backend.sentinel.remediation.services import (
    validate_remediation_approval,
    execute_remediation,
    RemediationService,
)
from backend.sentinel.remediation.configuration import RemediationConfig


def test_validate_remediation_approval():
    # True case
    assert validate_remediation_approval({"userConfirmed": True}) is True
    
    # False cases raise RemediationApprovalError
    with pytest.raises(RemediationApprovalError):
        validate_remediation_approval({"userConfirmed": False})
        
    with pytest.raises(RemediationApprovalError):
        validate_remediation_approval({})


def test_remediation_service_unauthorized_target(monkeypatch, tmp_path):
    audit_path = tmp_path / "audit.log"
    service = RemediationService(RemediationConfig(audit_log_path=str(audit_path)))
    
    # Mock allowlist check to return False
    monkeypatch.setattr(service.recon_service, "is_allowed_target", lambda domain: False)

    recommendations = [{"id": "r-001", "type": "header_hardening"}]
    target_details = {"targetDomain": "disallowed.com", "approvalContext": {"userConfirmed": True}}

    with pytest.raises(RemediationTargetNotAllowedError):
        service.execute_remediation("task-1", "fix", recommendations, target_details)


def test_remediation_service_execute_remediation_dry_run(monkeypatch, tmp_path):
    config_path = tmp_path / "nginx.conf"
    config_path.write_text("server { listen 80; }\n", encoding="utf-8")
    audit_path = tmp_path / "audit.log"
    
    service = RemediationService(RemediationConfig(audit_log_path=str(audit_path)))
    monkeypatch.setattr(service, "_local_nginx_config_path", lambda: config_path)
    monkeypatch.setattr(service.recon_service, "is_allowed_target", lambda domain: True)

    recommendations = [
        {"id": "r-001", "type": "header_hardening"},
        {"id": "r-002", "type": "tls_hardening"}
    ]
    target_details = {
        "targetDomain": "example.team-owned-site.com",
        "dryRun": True,
        "approvalContext": {"userConfirmed": True}
    }

    result = service.execute_remediation("task-2", "fix", recommendations, target_details)
    
    assert result["remediationStatus"] == "completed"
    assert len(result["remediationActions"]) >= 2
    assert any(act["recommendationId"] == "r-001" for act in result["remediationActions"])
    assert any(act["recommendationId"] == "r-002" for act in result["remediationActions"])
    
    assert len(result["auditTrail"]) > 0
    assert result["auditTrail"][0]["recommendationId"] == "r-000"


def test_remediation_service_unsupported_remediation(monkeypatch, tmp_path):
    audit_path = tmp_path / "audit.log"
    service = RemediationService(RemediationConfig(audit_log_path=str(audit_path)))
    monkeypatch.setattr(service.recon_service, "is_allowed_target", lambda domain: True)

    recommendations = [{"id": "r-003", "type": "unknown_fix_type"}]
    target_details = {"targetDomain": "example.team-owned-site.com", "approvalContext": {"userConfirmed": True}}

    with pytest.raises(UnsupportedRemediationError):
        service.execute_remediation("task-3", "fix", recommendations, target_details)
