from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os
from .routers import scan, report
from .exceptions import ApiValidationError, TaskNotFoundError, OrchestrationError
from ..recon.exceptions import TargetNotAllowedError
from ..scanner.exceptions import ScannerTargetNotAllowedError
from ..remediation.exceptions import RemediationTargetNotAllowedError

app = FastAPI(title="Sentinel AI Backend")

# CORS — allow the frontend dev server and docker-compose origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://localhost:3000",   # docker-compose frontend
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(TargetNotAllowedError)
@app.exception_handler(ScannerTargetNotAllowedError)
@app.exception_handler(RemediationTargetNotAllowedError)
def target_not_allowed_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=403,
        content={"detail": str(exc)}
    )

@app.exception_handler(TaskNotFoundError)
def task_not_found_handler(request: Request, exc: TaskNotFoundError):
    return JSONResponse(
        status_code=404,
        content={"detail": str(exc)}
    )

@app.exception_handler(ApiValidationError)
def api_validation_handler(request: Request, exc: ApiValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": str(exc)}
    )

@app.exception_handler(OrchestrationError)
def orchestration_handler(request: Request, exc: OrchestrationError):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)}
    )

app.include_router(scan.router, prefix="/api/scan", tags=["scan"])
app.include_router(report.router, prefix="/api/report", tags=["report"])


reports_dir = os.getenv(
    "REPORTS_PATH",
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "reports"))
)
os.makedirs(reports_dir, exist_ok=True)
app.mount("/reports", StaticFiles(directory=reports_dir), name="reports")

@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
