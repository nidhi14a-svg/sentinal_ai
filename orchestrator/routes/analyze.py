from fastapi import APIRouter
from models.schemas import AnalyzeRequest, AnalyzeResponse
from services.ai_service import run_analysis

router = APIRouter(tags=["AI Deep Dive"])

@router.post("/", response_model=AnalyzeResponse)
async def analyze_findings(request: AnalyzeRequest):
    print(f"[ROUTE] POST /analyze called for domain: {request.domain}")
    result = await run_analysis(request)
    return result