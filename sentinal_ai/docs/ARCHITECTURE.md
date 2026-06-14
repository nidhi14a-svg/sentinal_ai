# Sentinel AI Architecture

## Overview
Sentinel AI is a modular security audit platform built for autonomous reconnaissance, vulnerability scanning, AI analysis, remediation planning, and forensic reporting. The system is designed for a controlled test website owned and managed by the team.

## High-Level Components

- `frontend/`
  - React dashboard for scan initiation, status tracking, findings review, and remediation workflows.
- `backend/api/`
  - FastAPI endpoints for orchestrating scans, fetching results, applying fixes, and generating reports.
  **Task Orchestration:** `backend/api/services/scan_service.py` manages task lifecycle, coordinates module execution, and handles status/results retrieval.
  `backend/recon/`
  Domain reconnaissance services: DNS, WHOIS, SSL, port enumeration, service discovery.
  Enforces allowlist validation for controlled targets.
  `backend/scanner/`
  Vulnerability scanning wrappers for OWASP ZAP, Nikto, and ssl/sslyze checks.
  Normalizes findings for AI analysis.
  `backend/ai_analysis/`
  Claude AI integration: explanations, remediation advice, and prioritized findings.
  Processes scanner output into actionable recommendations.
- `backend/remediation/`
  - Remediation agent responsible for applying safe fixes to the controlled target.
- `backend/reporting/`
  - Forensic report generation using ReportLab and WeasyPrint.

## Data Flow

1. User enters a website domain in the React dashboard.
2. Frontend posts a scan request to FastAPI via `POST /api/scan/initiate`.
3. Backend API (`scan_service.py`) validates the domain against allowlist and creates a task.
4. **Background orchestration thread** executes:
  - Reconnaissance module performs DNS, SSL, and host discovery.
  - Vulnerability scanner module executes OWASP ZAP and Nikto jobs.
  - Findings are packaged and sent to Claude AI via `ai_analysis` service.
  - Claude returns explanations and remediation plans.
5. Frontend polls `GET /api/scan/{taskId}/status` for progress updates.
6. Frontend retrieves results via `GET /api/scan/{taskId}/results` to display findings and recommendations.
7. User triggers remediation with `POST /api/scan/{taskId}/fix` (single fix or fix-all).
8. Remediation agent applies approved fixes and logs audit trail.
9. Forensic report is generated on demand via `POST /api/report/{taskId}/generate`.
## Orchestration Model

Task orchestration has been consolidated into the backend API layer to simplify the architecture:

- **Single Entry Point:** All requests go through `POST /api/scan/initiate`, which creates a task and spawns a background orchestration thread.
- **Modular Execution:** The `ScanService` class in `backend/api/services/scan_service.py` coordinates execution across recon, scanner, AI analysis, and remediation modules.
- **Async Workflow:** Backend uses Python `threading` for background task execution. Frontend polls status endpoints to track progress.
- **Stateful Task Lifecycle:** Tasks progress through states: `queued` → `running` → `analysis` → `remediation` → `completed` (or `failed`).
- **In-Memory Task Store:** Current implementation uses in-memory task dictionary. For production, implement persistent storage (SQLite/PostgreSQL).

## Integration Boundaries

- Backend-to-frontend: JSON REST API with task-based lifecycle.
- Backend-to-AI: Claude API call wrapper with clearly defined prompt templates and structured results.
- Scanner modules: adapter interfaces for OWASP ZAP, Nikto, and ssl/sslyze.
- Remediation: automated change execution only against controlled target infrastructure.

## Deployment Model

- Local Docker Compose orchestrates:
  - FastAPI service
  - React development server
  - Optional scanner service containers for ZAP and Nikto
  - Persistent volume for reports and scan artifacts
- The application is not designed to perform scans outside the controlled target scope in v1.

## Security Constraints

- Only authorized domains owned by the team may be scanned.
- No multi-vector attack simulation in version 1.
- All scanner actions are logged and verified.
- AI-generated remediation is treated as advisory until user confirmation.

## Safe Demo Launch Configuration & Fail-Safes

To prevent accidental scans or configuration modifications on unauthorized environments during the hackathon, the following fail-safes are enforced:
1. **Allowlist Scope Hardening**: All API request entries validate domains against `sample_target/allowlist.txt`. If the domain is missing or invalid, the operation halts immediately with `TargetNotAllowedError` (HTTP 403).
2. **Scan Verification Mode**: When executing scans in audit or demo mode, scanners run in verification mode which simulates findings and verifies ports without triggering destructive network payloads.
3. **Remediation Guardrail**: The remediation executor validates the user confirmation within `approvalContext` before execution. If validation fails, it throws a `RemediationApprovalError` and halts safely.

## Folder Explanations

- `docs/` - Architecture, design, process, and team documentation.
- `specs/` - Formal API, security, and reporting specifications.
- `DEVELOPMENT_PLAN.md` - Phase-by-phase implementation roadmap.
- `TEAM_RESPONSIBILITIES.md` - Ownership, file mapping, and integration milestones.
- `API_CONTRACTS.md` - Service contracts between frontend, backend, AI, and agents.
- `DEPENDENCY_MAP.md` - Component dependency relationships and libraries.
