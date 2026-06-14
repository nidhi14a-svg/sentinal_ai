from typing import Any


class AIAnalysisInterface:
    """Defines Claude AI analysis contract."""

    def generate_analysis(self, target_domain: str, recon_summary: str, findings: list[dict[str, Any]]) -> dict[str, Any]:
        raise NotImplementedError


class AIPromptBuilderInterface:
    """Defines prompt builder contract for Claude calls."""

    def build_prompt(self, payload: dict[str, Any]) -> str:
        raise NotImplementedError
