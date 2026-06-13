from fastapi import APIRouter, Depends
from ..schemas.scan import ScanInitiateRequest, ScanStatusResponse, ScanResultsResponse, FixRequest, FixResponse
from ..dependencies import get_scan_service
from ..services.scan_service import ScanService

router = APIRouter()

@router.post("/initiate", response_model=ScanStatusResponse)
def initiate_scan(payload: ScanInitiateRequest, scan_service: ScanService = Depends(get_scan_service)):
    return scan_service.create_scan_task(payload)

@router.get("/{task_id}/status", response_model=ScanStatusResponse)
def scan_status(task_id: str, scan_service: ScanService = Depends(get_scan_service)):
    return scan_service.get_scan_status(task_id)

@router.get("/{task_id}/results", response_model=ScanResultsResponse)
def scan_results(task_id: str, scan_service: ScanService = Depends(get_scan_service)):
    return scan_service.get_scan_results(task_id)

@router.post("/{task_id}/fix", response_model=FixResponse)
def fix_scan(task_id: str, payload: FixRequest, scan_service: ScanService = Depends(get_scan_service)):
    return scan_service.process_fix_action(task_id, payload)
