from fastapi import APIRouter
from models.schemas import ReportRequest, ReportResponse
from services.ai_service import run_report

router = APIRouter(tags=["Report"])

@router.post("/", response_model=ReportResponse)
async def generate_report(request: ReportRequest):
    print(f"[ROUTE] POST /report called for domain: {request.domain}")
    result = await run_report(request)
    return result
