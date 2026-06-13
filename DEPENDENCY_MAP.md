# Sentinel AI Dependency Map

## Core Technologies
- Python: Backend orchestration, scanner wrappers, AI integration, remediation agent, reporting.
- FastAPI: Backend REST API service.
- React: Frontend dashboard.
- Docker / Docker Compose: Local orchestration.

## Security and Scanning Libraries
- `dnspython`: DNS lookups and reconnaissance.
- `requests`: HTTP API requests and integration.
- `python-whois`: WHOIS lookups and domain ownership metadata.
- `ssl`: SSL certificate inspection.
- `sslyze`: TLS/SSL analysis.
- `OWASP ZAP API`: Vulnerability scanning engine.
- `Nikto`: Web server vulnerability scanner.

## AI and Reporting Libraries
- Claude API: Natural-language analysis and remediation generation.
- `ReportLab`: PDF report generation.
- `WeasyPrint`: HTML-to-PDF rendering for forensic reports.

## Backend Subsystems
- `backend/api/` depends on:
  - `backend/orchestration/`
  - `backend/ai/`
  - `backend/reconnaissance/`
  - `backend/scanner/`
  - `backend/remediation/`
  - `backend/reporting/`
- `backend/orchestration/` depends on:
  - `backend/scanner/`
  - `backend/ai/`
  - `backend/remediation/`
  - `backend/reporting/`
- `backend/reconnaissance/` depends on:
  - `dnspython`
  - `python-whois`
  - `ssl`
  - `requests`
- `backend/scanner/` depends on:
  - `OWASP ZAP API`
  - `Nikto`
  - `sslyze`
- `backend/ai/` depends on:
  - Claude API client wrapper
  - `requests`
- `backend/reporting/` depends on:
  - `ReportLab`
  - `WeasyPrint`

## Frontend Dependencies
- `frontend/` depends on React and standard libraries only.
- It communicates with `backend/api/` via REST.
- It consumes task and report URLs from backend payloads.

## Infrastructure Dependencies
- `docker-compose.yml` (planned)
  - FastAPI service
  - React service
  - Optional OWASP ZAP container
  - Optional report artifact volume

## Dependency Ownership
- PERSON A: security and scanner dependencies.
- PERSON B: AI engine and reporting dependencies.
- PERSON C: orchestration, API, and frontend dependency flow.

## Dependency Risk Notes
- Claude API availability: mitigate with retry logic and fallback failure states.
- Scanner engine integration: isolate ZAP and Nikto adapters to avoid cross-impact.
- Report generation: ensure WeasyPrint environment requirements are captured in Docker configuration.

---

## Remediation Audit Trail & Rollback Validation

### 1. Audit Trail Structure
Remediation actions produce a JSON log in `backend/sentinel/remediation/remediation_audit.log` (or path configured via environment/config). Entries strictly adhere to:
- `timestamp`: UTC ISO8601 string.
- `action`: Remediation action type (e.g. `apply_fix`).
- `recommendationId`: Mapping back to the generated recommendation (e.g. `r-001`).
- `status`: Completion status (`applied`, `failed`, `verification`, or `dry_run`).

### 2. Rollback Readiness
- Configuration modifications (e.g. Nginx security headers and TLS/SSL ciphers hardening) preserve backups or track changes.
- Rollback can be performed using standard VCS (Git tracking) on local sample target configuration configurations, or by executing a rollback CLI action.
- The remediation agent performs syntax validation before applying Nginx configuration changes to prevent service failures.
