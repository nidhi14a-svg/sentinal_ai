from pydantic import BaseModel
from typing import Optional, List


class ScanInitiateRequest(BaseModel):
    domain: str
    scanProfile: str


class ScanStatusResponse(BaseModel):
    taskId: str
    status: str
    currentStep: Optional[str] = None
    progress: int
    startedAt: Optional[str] = None


class FindingsItem(BaseModel):
    findingId: str
    title: str
    severity: str
    description: str
    recommendationId: Optional[str]


class AIAnalysisItem(BaseModel):
    analysisSummary: str
    confidenceNotes: str
    recommendations: list[dict]


class ScanResultsResponse(BaseModel):
    taskId: str
    domain: str
    reconData: dict
    findings: List[FindingsItem]
    aiAnalysis: AIAnalysisItem
    reportReady: bool


class FixRequest(BaseModel):
    action: str
    recommendationId: Optional[str] = None


class FixResponse(BaseModel):
    taskId: str
    remediationStatus: str
