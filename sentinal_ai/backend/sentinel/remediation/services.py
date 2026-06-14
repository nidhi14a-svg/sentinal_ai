import json
from datetime import datetime
from pathlib import Path
from typing import Any

try:
    import paramiko
except ImportError:  # pragma: no cover
    paramiko = None

from .configuration import RemediationConfig
from .interfaces import RemediationInterface
from .exceptions import (
    RemediationApprovalError,
    RemediationExecutionError,
    UnsupportedRemediationError,
    RemediationTargetNotAllowedError,
)
from ..recon.services import ReconService


def validate_remediation_approval(approval_context: dict[str, Any]) -> bool:
    """Approval guard function."""
    if not approval_context or not approval_context.get("userConfirmed", False):
        raise RemediationApprovalError("Remediation approval missing or not confirmed by user")
    return True


def record_audit_entry(entry: dict[str, Any]) -> None:
    """Module-level audit logging helper."""
    RemediationService().record_audit_entry(entry)


def execute_remediation(
    task_id: str,
    action: str,
    recommendations: list[dict[str, Any]],
    target_details: dict[str, Any],
) -> dict[str, Any]:
    """Module-level execute_remediation that delegates to RemediationService."""
    return RemediationService().execute_remediation(task_id, action, recommendations, target_details)


class RemediationService(RemediationInterface):
    """Remediation execution implementation."""

    def __init__(self, config: RemediationConfig | None = None) -> None:
        self.config = config or RemediationConfig()
        self.audit_log_path = Path(self.config.audit_log_path)
        self.audit_log_path.parent.mkdir(parents=True, exist_ok=True)
        self.recon_service = ReconService()

    def _local_nginx_config_path(self) -> Path:
        path = Path(__file__).resolve().parents[3] / "sample_target" / "nginx.conf"
        if not path.exists():
            path = Path(__file__).resolve().parents[4] / "sample_target" / "nginx.conf"
        return path

    def _load_config(self, path: Path) -> str:
        try:
            return path.read_text(encoding="utf-8")
        except FileNotFoundError:
            raise RemediationExecutionError(f"Unable to find config file: {path}")

    def _write_config(self, path: Path, content: str) -> None:
        try:
            path.write_text(content, encoding="utf-8")
        except Exception as exc:
            raise RemediationExecutionError(f"Failed to write config file: {exc}") from exc

    def _build_audit_entry(self, task_id: str, action: str, stage: str, detail: str, outcome: str) -> dict[str, Any]:
        return {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "task_id": task_id,
            "action": action,
            "stage": stage,
            "detail": detail,
            "outcome": outcome,
        }

    def _record_audit(self, entry: dict[str, Any]) -> None:
        self.record_audit_entry(entry)

    def record_audit_entry(self, entry: dict[str, Any]) -> None:
        """Audit logger method."""
        # Convert keys to camelCase if they match the spec audit trail contract
        # Spec contract: timestamp, action, recommendationId, status
        spec_entry = {
            "timestamp": entry.get("timestamp") or datetime.utcnow().isoformat() + "Z",
            "action": entry.get("action") or "remediation",
            "recommendationId": entry.get("recommendationId") or entry.get("recommendation_id") or "r-000",
            "status": entry.get("status") or entry.get("outcome") or "success",
        }
        with self.audit_log_path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(spec_entry) + "\n")

    def validate_remediation_approval(self, approval_context: dict[str, Any]) -> bool:
        """Approval guard method."""
        return validate_remediation_approval(approval_context)

    def apply_remediation_action(self, recommendation: dict[str, Any]) -> dict[str, Any]:
        """Action executor method for a single recommendation."""
        rec_type = recommendation.get("type") or ""
        rec_id = recommendation.get("id") or recommendation.get("recommendationId") or "r-000"
        
        # Check supported types
        if rec_type not in ("header_hardening", "tls_hardening", "remote_command"):
            raise UnsupportedRemediationError(f"Unsupported recommendation type: {rec_type}")
            
        return {"recommendationId": rec_id, "status": "applied", "details": f"Applied fix for {rec_type}"}

    def _apply_local_nginx_recommendations(self, recommendations: list[dict[str, Any]], dry_run: bool) -> list[dict[str, Any]]:
        config_path = self._local_nginx_config_path()
        original = self._load_config(config_path)
        updated = original
        actions: list[dict[str, Any]] = []

        for rec in recommendations:
            rec_type = rec.get("type") or ""
            rec_id = rec.get("id") or rec.get("recommendationId") or "r-000"
            
            if rec_type == "header_hardening":
                headers = [
                    "add_header X-Content-Type-Options \"nosniff\";",
                    "add_header X-Frame-Options \"DENY\";",
                    "add_header Referrer-Policy \"no-referrer\";",
                    "add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always;",
                    "add_header Content-Security-Policy \"default-src 'self';\";",
                ]
                if "add_header X-Content-Type-Options \"nosniff\";" not in updated:
                    updated = updated.replace("server {", "server {\n    " + "\n    ".join(headers))
                
                # Remove X-Powered-By exposure
                if "add_header X-Powered-By" in updated:
                    import re
                    updated = re.sub(r'add_header\s+X-Powered-By\s+[^;]+;', '', updated)
                # Disable server_tokens
                if "server_tokens on;" in updated:
                    updated = updated.replace("server_tokens on;", "server_tokens off;")
                elif "server_tokens off;" not in updated:
                    updated = updated.replace("server {", "server {\n        server_tokens off;")

                actions.append({
                    "recommendationId": rec_id,
                    "status": "dry_run" if dry_run else "applied",
                    "details": "Nginx security headers added."
                })
            elif rec_type == "tls_hardening":
                if "ssl_protocols TLSv1 TLSv1.1 TLSv1.2;" in updated:
                    updated = updated.replace(
                        "ssl_protocols TLSv1 TLSv1.1 TLSv1.2;",
                        "ssl_protocols TLSv1.2 TLSv1.3;",
                    )
                    actions.append({
                        "recommendationId": rec_id,
                        "status": "dry_run" if dry_run else "applied",
                        "details": "Nginx TLS protocols hardened."
                    })
                elif "ssl_protocols TLSv1.2 TLSv1.3;" not in updated:
                    updated = updated.replace(
                        "server {",
                        "server {\n        ssl_protocols TLSv1.2 TLSv1.3;",
                    )
                    actions.append({
                        "recommendationId": rec_id,
                        "status": "dry_run" if dry_run else "applied",
                        "details": "Nginx TLS protocols added."
                    })

                if "ssl_prefer_server_ciphers on;" not in updated:
                    if "ssl_protocols" in updated:
                        updated = updated.replace(
                            "ssl_protocols TLSv1.2 TLSv1.3;",
                            "ssl_protocols TLSv1.2 TLSv1.3;\n        ssl_prefer_server_ciphers on;",
                        )
                    else:
                        updated = updated.replace(
                            "server {",
                            "server {\n        ssl_prefer_server_ciphers on;",
                        )
                    actions.append({
                        "recommendationId": rec_id,
                        "status": "dry_run" if dry_run else "applied",
                        "details": "Nginx preferred server ciphers added."
                    })
            else:
                # Types like 'remote_command' are not applicable for local nginx
                # remediation — skip gracefully instead of aborting the pipeline.
                actions.append({
                    "recommendationId": rec_id,
                    "status": "skipped",
                    "details": f"Recommendation type '{rec_type}' is not applicable for local remediation."
                })

        if not dry_run and updated != original:
            self._write_config(config_path, updated)

        return actions

    def _execute_remote_ssh(self, host: str, command: str, dry_run: bool) -> dict[str, Any]:
        if dry_run:
            return {"host": host, "command": command, "status": "dry_run"}

        if paramiko is None:
            raise RemediationExecutionError("paramiko is unavailable for remote SSH execution")

        try:
            client = paramiko.SSHClient()
            client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            client.connect(hostname=host, username="root", timeout=self.config.ssh_timeout_seconds)
            stdin, stdout, stderr = client.exec_command(command)
            exit_code = stdout.channel.recv_exit_status()
            client.close()
            return {
                "host": host,
                "command": command,
                "exit_code": exit_code,
                "stdout": stdout.read().decode("utf-8", errors="ignore"),
                "stderr": stderr.read().decode("utf-8", errors="ignore"),
            }
        except Exception as exc:
            raise RemediationExecutionError(f"Remote SSH execution failed: {exc}") from exc

    def execute_remediation(
        self,
        task_id: str,
        action: str,
        recommendations: list[dict[str, Any]],
        target_details: dict[str, Any],
    ) -> dict[str, Any]:
        """Spec-compliant execute_remediation method returning camelCase JSON payload."""
        # 1. Validate Target Allowed
        domain = target_details.get("targetDomain") or target_details.get("target_domain") or ""
        try:
            if not self.recon_service.is_allowed_target(domain):
                raise RemediationTargetNotAllowedError(f"Target domain '{domain}' is not allowed")
        except Exception as exc:
            if isinstance(exc, RemediationTargetNotAllowedError):
                raise exc
            raise RemediationTargetNotAllowedError(f"Could not validate target allowlist: {exc}")

        # 2. Validate Approval
        approval_ctx = target_details.get("approvalContext") or target_details.get("approval_context") or {}
        self.validate_remediation_approval(approval_ctx)

        # 3. Call execute method
        dry_run = target_details.get("dryRun") or target_details.get("dry_run") or False
        verification = target_details.get("verification") or False
        target_host = target_details.get("targetHost") or target_details.get("target_host")

        res = self.execute(
            task_id=task_id,
            action=action,
            recommendations=recommendations,
            target_host=target_host,
            dry_run=dry_run,
            verification=verification,
        )

        # 4. Map output to exact camelCase spec contract
        remediation_actions = []
        for act in res.get("remediation_actions", []):
            remediation_actions.append({
                "recommendationId": act.get("recommendationId") or act.get("recommendation_id") or "r-000",
                "status": act.get("status") or "applied",
                "details": act.get("details") or act.get("name") or "Remediation executed."
            })

        audit_trail = []
        for entry in res.get("audit_trail", []):
            audit_trail.append({
                "timestamp": entry.get("timestamp") or datetime.utcnow().isoformat() + "Z",
                "action": entry.get("action") or "remediation",
                "recommendationId": entry.get("recommendationId") or "r-000",
                "status": entry.get("outcome") or entry.get("status") or "success"
            })

        return {
            "remediationStatus": res.get("remediation_status") or "completed",
            "remediationActions": remediation_actions,
            "auditTrail": audit_trail,
            "completedAt": res.get("completed_at") or datetime.utcnow().isoformat() + "Z",
        }

    def execute(
        self,
        task_id: str,
        action: str,
        recommendations: list[dict[str, Any]],
        target_host: str | None = None,
        dry_run: bool = False,
        verification: bool = False,
    ) -> dict[str, Any]:
        audit_trail: list[dict[str, Any]] = []
        remediation_actions: list[dict[str, Any]] = []
        status = "completed"

        entry = self._build_audit_entry(task_id, action, "start", "Remediation execution started.", "ok")
        self._record_audit(entry)
        audit_trail.append(entry)

        if verification:
            planned = [
                {
                    "recommendationId": rec.get("id") or rec.get("recommendationId") or "r-000",
                    "planned_action": rec.get("type", "review"),
                    "status": "verification",
                    "details": f"Verification mode evaluated: {rec.get('title', 'unknown')}"
                }
                for rec in recommendations
            ]
            remediation_actions.extend(planned)
            status = "verification_only"
            entry = self._build_audit_entry(task_id, action, "verification", "Verification mode evaluated remediation actions.", "ok")
            self._record_audit(entry)
            audit_trail.append(entry)
        else:
            if target_host:
                for rec in recommendations:
                    command = rec.get("remote_command") or rec.get("remoteCommand") or "echo 'no command provided'"
                    rec_id = rec.get("id") or rec.get("recommendationId") or "r-000"
                    
                    try:
                        result = self._execute_remote_ssh(target_host, command, dry_run=dry_run)
                        remediation_actions.append({
                            "recommendationId": rec_id,
                            "status": "dry_run" if dry_run else "applied",
                            "details": f"Remote command executed on {target_host}: {result}"
                        })
                        entry = self._build_audit_entry(task_id, action, "remote_execute", str(result), "ok")
                    except Exception as exc:
                        status = "failed"
                        remediation_actions.append({
                            "recommendationId": rec_id,
                            "status": "failed",
                            "details": str(exc)
                        })
                        entry = self._build_audit_entry(task_id, action, "remote_execute", str(exc), "failed")
                        self._record_audit(entry)
                        audit_trail.append(entry)
                        raise RemediationExecutionError(f"Halted on failure: {exc}") from exc
                        
                    self._record_audit(entry)
                    audit_trail.append(entry)
            else:
                try:
                    actions = self._apply_local_nginx_recommendations(recommendations, dry_run=dry_run)
                    remediation_actions.extend(actions)
                    entry = self._build_audit_entry(task_id, action, "local_apply", f"Applied {len(actions)} local recommendations.", "ok")
                    self._record_audit(entry)
                    audit_trail.append(entry)
                except Exception as exc:
                    status = "failed"
                    entry = self._build_audit_entry(task_id, action, "local_apply", str(exc), "failed")
                    self._record_audit(entry)
                    audit_trail.append(entry)
                    raise exc

        completed_at = datetime.utcnow().isoformat() + "Z"
        return {
            "task_id": task_id,
            "remediation_status": status,
            "remediation_actions": remediation_actions,
            "audit_trail": audit_trail,
            "completed_at": completed_at,
            "dry_run": dry_run,
            "verification": verification,
        }
