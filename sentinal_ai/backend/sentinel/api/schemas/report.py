from pydantic import BaseModel


class ReportResponse(BaseModel):
    taskId: str
    reportUrl: str
    artifactPath: str
