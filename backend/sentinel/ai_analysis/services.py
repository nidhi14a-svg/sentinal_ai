from typing import Any
from .interfaces import AIAnalysisInterface


class AIAnalysisService(AIAnalysisInterface):
    """Mock/conforming AI analysis service for integration."""

    def generate_analysis(self, target_domain: str, recon_summary: str, findings: list[dict[str, Any]]) -> dict[str, Any]:
        """Translates scanner output into human-readable recommendations matching SPEC_AI_ANALYSIS."""
        recommendations = []
        
        # Analyze findings and generate corresponding recommendations
        for idx, finding in enumerate(findings, start=1):
            finding_id = finding.get("findingId") or finding.get("finding_id") or f"f-{idx:03d}"
            title = finding.get("title") or "Security finding"
            severity = finding.get("severity") or "medium"
            desc = finding.get("description") or "Potential security risk detected."
            source = finding.get("source") or "ZAP"
            
            # Map source/title to remediation type
            rec_type = "header_hardening"
            if "ssl" in title.lower() or "tls" in title.lower() or "ssl" in source.lower():
                rec_type = "tls_hardening"
            elif "header" in title.lower() or "header" in desc.lower():
                rec_type = "header_hardening"
                
            recommendations.append({
                "id": f"r-{idx:03d}",
                "findingId": finding_id,
                "title": f"Mitigate: {title}",
                "severity": severity,
                "description": f"AI recommended fix for {title}. {desc}",
                "remediation": "Update Nginx configuration parameters.",
                "estimatedEffort": "low",
                "type": rec_type,  # Remediation agent type contract mapping
            })
            
        if not recommendations:
            # Provide at least one default recommendation so remediation/dashboard flow works
            recommendations.append({
                "id": "r-001",
                "findingId": "f-001",
                "title": "Add security headers",
                "severity": "medium",
                "description": "Add Strict-Transport-Security and Content-Security-Policy headers.",
                "remediation": "Update Nginx config to include headers.",
                "estimatedEffort": "low",
                "type": "header_hardening",
            })

        return {
            "analysisSummary": f"The scan identified {len(findings)} issues on {target_domain}. {recon_summary}",
            "recommendations": recommendations,
            "confidenceNotes": "Recommendations are based on scanner evidence and team-owned target policies.",
            "aiResponseMetadata": {
                "model": "claude-v1",
                "responseTimeMs": 150
            }
        }
