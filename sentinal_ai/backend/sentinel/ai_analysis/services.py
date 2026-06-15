from typing import Any
import json
import logging

from .interfaces import AIAnalysisInterface
from .claude_client import ClaudeClient, ClaudeClientError

_log = logging.getLogger(__name__)


class AIAnalysisService(AIAnalysisInterface):
    """AI analysis service that prefers Claude API but falls back to heuristics.

    Behaviour:
    - If a configured ClaudeClient is usable (CLAUDE_API_KEY and CLAUDE_API_URL set),
      send a structured prompt and parse the JSON response.
    - Retry once on parse/network failures.
    - If Claude is not configured or fails, fall back to the previous deterministic
      heuristic generator to keep the orchestration pipeline functional.
    """

    def __init__(self) -> None:
        self.claude = ClaudeClient()

    def generate_analysis(self, target_domain: str, recon_summary: str, findings: list[dict[str, Any]]) -> dict[str, Any]:
        # Build the prompt payload for Claude
        payload = {
            "targetDomain": target_domain,
            "reconSummary": recon_summary,
            "normalizedFindings": findings,
            "scanProfile": "full-scan",
        }

        # If Claude client is configured, attempt a call
        if self.claude.is_usable():
            prompt = self._build_claude_prompt(payload)
            try:
                raw = self.claude.send_analysis_prompt(prompt, max_retries=1)
                # Accept the parsed JSON if it contains the expected keys
                if isinstance(raw, dict) and "recommendations" in raw:
                    return raw
                _log.warning("Claude returned payload missing 'recommendations'; falling back to heuristic generator")
            except ClaudeClientError as exc:
                _log.warning("Claude client error: %s. Falling back to heuristic generator.", exc)

        # Fallback heuristic generator (keeps previous behaviour)
        return self._heuristic_generate(target_domain, recon_summary, findings)

    def _build_claude_prompt(self, payload: dict[str, Any]) -> str:
        # Instruction: strict JSON output with required schema
        instruction = (
            "You are an AI assistant that MUST output strict JSON only (no markdown). "
            "Given the input payload, produce a JSON object with keys: analysisSummary, confidenceNotes, recommendations. "
            "Each recommendation must include id, findingId, title, severity, description, remediation, estimatedEffort, and type (one of header_hardening, tls_hardening, remote_command)."
        )
        return json.dumps({"instruction": instruction, "payload": payload})

    def _heuristic_generate(self, target_domain: str, recon_summary: str, findings: list[dict[str, Any]]) -> dict[str, Any]:
        recommendations = []
        for idx, finding in enumerate(findings, start=1):
            finding_id = finding.get("findingId") or finding.get("finding_id") or f"f-{idx:03d}"
            title = finding.get("title") or "Security finding"
            severity = self._normalize_severity(str(finding.get("severity") or "medium"))
            description = finding.get("description") or "Potential security risk detected."
            source = finding.get("source") or "scanner"

            # Very small heuristic mapping to maintain compatibility when Claude is absent
            rec_type = "header_hardening"
            low_title = str(title).lower()
            if any(k in low_title for k in ["tls", "ssl", "legacy tls", "tlsv1"]):
                rec_type = "tls_hardening"
            elif any(k in low_title for k in ["content-security-policy", "csp", "x-frame", "x-content-type", "x-powered-by", "server_tokens", "hsts", "strict-transport-security", "referrer-policy", "header"]):
                rec_type = "header_hardening"
            else:
                rec_type = "remote_command"

            recommendations.append({
                "id": f"r-{idx:03d}",
                "findingId": finding_id,
                "title": f"Mitigate: {title}",
                "severity": severity,
                "description": f"AI suggested: {description}",
                "remediation": "Refer to security header and TLS hardening guidance.",
                "estimatedEffort": "low",
                "type": rec_type,
            })

        return {
            "analysisSummary": f"The scan for {target_domain} returned {len(findings)} findings. {recon_summary}",
            "confidenceNotes": "Fallback heuristic recommendations — replace with Claude outputs when available.",
            "recommendations": recommendations,
        }

    def _normalize_severity(self, severity: str) -> str:
        normalized = severity.lower().strip()
        if normalized in {"high", "medium", "low", "info"}:
            return normalized
        return "medium"

