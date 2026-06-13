from fastapi import APIRouter, Depends
from ..schemas.report import ReportResponse
from ..dependencies import get_report_service
from ..services.report_service import ReportService

router = APIRouter()

@router.post("/{task_id}/generate", response_model=ReportResponse)
def generate_report(task_id: str, report_service: ReportService = Depends(get_report_service)):
    return report_service.generate_report(task_id)
