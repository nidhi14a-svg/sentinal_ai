from typing import Any


class ReportingInterface:
    """Defines forensic report generation contract."""

    def generate_report(self, report_payload: dict[str, Any]) -> dict[str, Any]:
        raise NotImplementedError


class ReportRendererInterface:
    """Defines report rendering contract."""

    def render_pdf(self, report_model: dict[str, Any]) -> bytes:
        raise NotImplementedError

    def render_html(self, report_model: dict[str, Any]) -> str:
        raise NotImplementedError
