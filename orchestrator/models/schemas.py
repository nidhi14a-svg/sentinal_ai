from pydantic import BaseModel
from typing import List, Optional

class ScanRequest(BaseModel):
    domain: str
    deployment_url: Optional[str] = None
    scan_profile: str = "standard"

class Finding(BaseModel):
    id: str
    title: str
    severity: str
    description: str
    evidence: str
    location: Optional[str] = None

class ScanResponse(BaseModel):
    domain: str
    scan_time: str
    findings: List[Finding]
    total_findings: int
    security_score: int

class AnalyzeRequest(BaseModel):
    findings: List[Finding]
    domain: str

class AIAnalysis(BaseModel):
    id: str
    title: str
    severity: str
    explanation: str
    impact: str
    recommended_fix: str
    code_snippet: Optional[str] = None
    confidence: int

class AnalyzeResponse(BaseModel):
    domain: str
    analysis: List[AIAnalysis]

class RemediateRequest(BaseModel):
    findings: List[Finding]
    domain: str

class RemediationLog(BaseModel):
    time: str
    action: str
    status: str
    details: Optional[str] = None

class RemediateResponse(BaseModel):
    domain: str
    logs: List[RemediationLog]
    success_count: int
    security_score_after: int

class ReportRequest(BaseModel):
    domain: str
    deployment_url: Optional[str] = None
    score_before: Optional[int] = None
    score_after: Optional[int] = None
    scan_results: Optional[ScanResponse] = None
    ai_analysis: Optional[AnalyzeResponse] = None
    remediation_results: Optional[RemediateResponse] = None

class ReportResponse(BaseModel):
    report_id: str
    domain: str
    generated_at: str
    pdf_url: Optional[str] = None
    summary: str

class ErrorResponse(BaseModel):
    error: str
    detail: str
    status_code: int