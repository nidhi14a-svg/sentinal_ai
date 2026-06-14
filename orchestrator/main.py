from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from config import SCANNER_BASE_URL, AI_BASE_URL, FRONTEND_ORIGIN
from routes.scan import router as scan_router
from routes.analyze import router as analyze_router
from routes.remediate import router as remediate_router
from routes.report import router as report_router

app = FastAPI(
    title="Sentinel AI Orchestrator",
    description="Backend orchestrator connecting scanner, AI analysis and report generation",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(scan_router, prefix="/scan")
app.include_router(analyze_router, prefix="/analyze")
app.include_router(remediate_router, prefix="/remediate")
app.include_router(report_router, prefix="/report")

@app.get("/")
async def root():
    return {
        "name": "Sentinel AI Orchestrator",
        "status": "online",
        "version": "1.0.0",
        "endpoints": ["/scan", "/analyze", "/remediate", "/report"]
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "scanner_url": SCANNER_BASE_URL,
        "ai_url": AI_BASE_URL,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

print("[INFO] Sentinel AI Orchestrator starting...")
print(f"[INFO] Scanner API: {SCANNER_BASE_URL}")
print(f"[INFO] AI API: {AI_BASE_URL}")
print(f"[INFO] Frontend: {FRONTEND_ORIGIN}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)