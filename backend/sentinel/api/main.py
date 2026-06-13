from fastapi import FastAPI
from .routers import scan, report

app = FastAPI(title="Sentinel AI Backend")

app.include_router(scan.router, prefix="/api/scan", tags=["scan"])
app.include_router(report.router, prefix="/api/report", tags=["report"])

@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
