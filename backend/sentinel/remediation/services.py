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


class RemediationService(RemediationInterface):
    """Remediation execution implementation."""

    def __init__(self, config: RemediationConfig | None = None) -> None:
        self.config = config or RemediationConfig()
        self.audit_log_path = Path(self.config.audit_log_path)
        self.audit_log_path.parent.mkdir(parents=True, exist_ok=True)

    def _local_nginx_config_path(self) -> Path:
        return Path(__file__).resolve().parents[4] / "sample_target" / "nginx.conf"

    def _load_config(self, path: Path) -> str:
        try:
            return path.read_text(encoding="utf-8")
        except FileNotFoundError:
            raise FileNotFoundError(f"Unable to find config file: {path}")

    def _write_config(self, path: Path, content: str) -> None:
        path.write_text(content, encoding="utf-8")

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
        with self.audit_log_path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(entry) + "\n")

    def _apply_local_nginx_recommendations(self, recommendations: list[dict[str, Any]], dry_run: bool) -> list[dict[str, Any]]:
        config_path = self._local_nginx_config_path()
        original = self._load_config(config_path)
        updated = original
        actions: list[dict[str, Any]] = []

        if any(rec.get("type") == "header_hardening" for rec in recommendations):
            headers = [
                "add_header X-Content-Type-Options \"nosniff\";",
                "add_header X-Frame-Options \"DENY\";",
                "add_header Referrer-Policy \"no-referrer\";",
                "add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always;",
            ]
            if "add_header X-Content-Type-Options \"nosniff\";" not in updated:
                updated = updated.replace("server {", "server {\n    " + "\n    ".join(headers))
                actions.append({"name": "Add security headers", "path": str(config_path), "status": "pending"})

        if any(rec.get("type") == "tls_hardening" for rec in recommendations):
            if "ssl_protocols TLSv1 TLSv1.1 TLSv1.2;" in updated:
                updated = updated.replace(
                    "ssl_protocols TLSv1 TLSv1.1 TLSv1.2;",
                    "ssl_protocols TLSv1.2 TLSv1.3;",
                )
                actions.append({"name": "Harden TLS protocol settings", "path": str(config_path), "status": "pending"})
            elif "ssl_protocols TLSv1.2 TLSv1.3;" not in updated:
                updated = updated.replace(
                    "server {",
                    "server {\n        ssl_protocols TLSv1.2 TLSv1.3;",
                )
                actions.append({"name": "Add TLS protocol settings", "path": str(config_path), "status": "pending"})

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
                actions.append({"name": "Add server cipher preference", "path": str(config_path), "status": "pending"})

        if not dry_run and updated != original:
            self._write_config(config_path, updated)
            for action in actions:
                action["status"] = "applied"
        elif dry_run:
            for action in actions:
                action["status"] = "dry_run"

        return actions

    def _execute_remote_ssh(self, host: str, command: str, dry_run: bool) -> dict[str, Any]:
        if dry_run:
            return {"host": host, "command": command, "status": "dry_run"}

        if paramiko is None:
            return {"host": host, "command": command, "error": "paramiko unavailable", "status": "failed"}

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
                {"recommendation": rec.get("title", "unknown"), "planned_action": rec.get("type", "review"), "status": "verification"}
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
                    command = rec.get("remote_command", "echo 'no command provided'")
                    result = self._execute_remote_ssh(target_host, command, dry_run=dry_run)
                    remediation_actions.append({"recommendation": rec.get("title", "remote_change"), "result": result})
                    entry = self._build_audit_entry(task_id, action, "remote_execute", str(result), "ok")
                    self._record_audit(entry)
                    audit_trail.append(entry)
            else:
                actions = self._apply_local_nginx_recommendations(recommendations, dry_run=dry_run)
                remediation_actions.extend(actions)
                entry = self._build_audit_entry(task_id, action, "local_apply", f"Applied {len(actions)} local recommendations.", "ok")
                self._record_audit(entry)
                audit_trail.append(entry)

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
