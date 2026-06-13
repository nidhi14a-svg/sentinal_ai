# SPEC_FASTAPI_ORCHESTRATION

## 1. Purpose
Define the FastAPI orchestration subsystem for Sentinel AI, including task lifecycle, service integration, and backend API contracts.

## 2. Scope
- Manage scan task creation, status, result retrieval, remediation invocation, and report generation.
- Coordinate the domain recon, scanner, AI, remediation, and reporting subsystems.
- Provide REST endpoints for the React frontend.
- Exclude direct scanning engine logic and AI prompt composition.

## 3. Owner
PERSON C

## 4. Technologies Used
- Python
- FastAPI
- Pydantic
- requests

## 5. Inputs
- `POST /api/scan/initiate`: `domain`, `scanProfile`
- `GET /api/scan/{taskId}/status`
- `GET /api/scan/{taskId}/results`
- `POST /api/scan/{taskId}/fix`: `action`, `recommendationId`
- `POST /api/report/{taskId}/generate`

## 6. Outputs
- Task identifiers and status payloads.
- Scan results and AI analysis.
- Remediation statuses.
- Report artifact metadata.

## 7. JSON Contracts
### `POST /api/scan/initiate`
Request:
{
  "domain": "example.team-owned-site.com",
  "scanProfile": "full-scan"
}
Response:
{
  "taskId": "task-1234",
  "status": "queued",
  "startedAt": "2026-06-13T14:00:00Z"
}

### `GET /api/scan/{taskId}/status`
Response:
{
  "taskId": "task-1234",
  "status": "analysis",
  "currentStep": "ai_analysis",
  "progress": 60
}

### `GET /api/scan/{taskId}/results`
Response:
{
  "taskId": "task-1234",
  "domain": "example.team-owned-site.com",
  "reconData": {...},
  "findings": [...],
  "aiAnalysis": {...},
  "reportReady": false
}

### `POST /api/scan/{taskId}/fix`
Request:
{
  "action": "fix",
  "recommendationId": "r-001"
}
Response:
{
  "taskId": "task-1234",
  "remediationStatus": "scheduled"
}

### `POST /api/report/{taskId}/generate`
Response:
{
  "taskId": "task-1234",
  "reportUrl": "http://localhost:8000/reports/report-1234.pdf",
  "artifactPath": "/app/reports/report-1234.pdf"
}

## 8. Interfaces
- `create_scan_task(domain, scan_profile)`
- `get_scan_status(task_id)`
- `get_scan_results(task_id)`
- `process_remediation(task_id, action, recommendation_id)`
- `generate_report(task_id)`
- `orchestrate_workflow(task_id)`
- Error classes: `ApiValidationError`, `TaskNotFoundError`, `OrchestrationError`

## 9. Error Handling
- Input validation errors: HTTP 422 with details.
- Unauthorized domain: HTTP 403 `TargetNotAllowedError`.
- Task not found: HTTP 404 `TaskNotFoundError`.
- Workflow failure: HTTP 500 `OrchestrationError`.
- Downstream service errors: return structured error payload with `retryable` flag.

## 10. Testing Strategy
- API contract tests for each endpoint.
- Mocked service integration tests for orchestration sequences.
- Validation tests for domain allowlist enforcement.
- Status transition tests for task lifecycle.
- End-to-end integration tests using stubbed subsystem responses.

## 11. Acceptance Criteria
- All endpoints conform to defined JSON contracts.
- Task lifecycle status is consistent and reliable.
- Domain allowlist enforcement is validated on initiation.
- Downstream subsystem errors are surfaced clearly.
- The frontend can consume the endpoints without additional backend changes.

## 12. Integration Requirements
- Invoke `SPEC_DOMAIN_RECON.md` before starting scans.
- Forward normalized scanner output to `SPEC_AI_ANALYSIS.md`.
- Provide remediation triggers to `SPEC_REMEDIATION_AGENT.md`.
- Send report generation requests to `SPEC_FORENSIC_REPORT.md`.
- Share API contract definitions with `SPEC_FRONTEND_DASHBOARD.md`.
