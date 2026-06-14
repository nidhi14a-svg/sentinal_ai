from fastapi import APIRouter
from models.schemas import RemediateRequest, RemediateResponse
from services.scanner_service import run_remediation

router = APIRouter(tags=["Remediation"])

@router.post("/", response_model=RemediateResponse)
async def remediate_findings(request: RemediateRequest):
    print(f"[ROUTE] POST /remediate called for domain: {request.domain}")
    result = await run_remediation(request.findings, request.domain)
    return RemediateResponse(**result)
