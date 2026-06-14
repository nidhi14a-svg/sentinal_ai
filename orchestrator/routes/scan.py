from fastapi import APIRouter
from models.schemas import ScanRequest, ScanResponse
from services.scanner_service import run_scan

router = APIRouter(tags=["Scanner"])

@router.post("/", response_model=ScanResponse)
async def scan_domain(request: ScanRequest):
    print(f"[ROUTE] POST /scan called for domain: {request.domain}")
    result = await run_scan(request)
    return result