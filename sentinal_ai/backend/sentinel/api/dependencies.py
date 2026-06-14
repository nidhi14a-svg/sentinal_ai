from .services.scan_service import ScanService
from .services.report_service import ReportService


def get_scan_service() -> ScanService:
    return ScanService()


def get_report_service() -> ReportService:
    return ReportService()
