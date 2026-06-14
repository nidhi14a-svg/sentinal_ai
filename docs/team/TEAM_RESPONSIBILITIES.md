# Sentinel AI Team Responsibilities

## Team Structure

- PERSON A: Domain Recon, Vulnerability Scanner, Remediation Agent
- PERSON B: Claude AI Integration, AI Analysis Engine, Forensic Report Generator
- PERSON C: React Dashboard, FastAPI Backend Orchestration, Integration Layer

## Ownership Summary

### PERSON A
- Core modules:
  - `backend/reconnaissance/`
  - `backend/scanner/`
  - `backend/remediation/`
- Primary technologies:
  - Python, dnspython, requests, python-whois, ssl, sslyze
  - OWASP ZAP API, Nikto
  - SSH automation, Nginx configuration management
- Key responsibilities:
  - Design recon scanning pipeline.
  - Implement scanner adapters and controlled target validation.
  - Build remediation agent interfaces and fix orchestration.
  - Produce security scope spec for safe scanning.

### PERSON B
- Core modules:
  - `backend/ai/`
  - `backend/reporting/`
- Primary technologies:
  - Claude API, ReportLab, WeasyPrint, Python
- Key responsibilities:
  - Define AI input/output contracts for findings.
  - Implement analysis engine and remediation plan generation.
  - Design forensic report schema and rendering pipelines.
  - Create `specs/reporting/forensic_report_spec.md` and report templates.

### PERSON C
- Core modules:
  - `frontend/`
  - `backend/orchestration/`
  - `backend/api/`
- Primary technologies:
  - React, FastAPI, Python
- Key responsibilities:
  - Define frontend workflows and dashboard components.
  - Coordinate backend API design and task orchestration.
  - Integrate modules from PERSON A and PERSON B.
  - Own system-level acceptance criteria and demo readiness.

## File Ownership Mapping

- `ARCHITECTURE.md` - PERSON C
- `API_CONTRACTS.md` - PERSON C
- `DEPENDENCY_MAP.md` - Shared ownership
- `DEVELOPMENT_PLAN.md` - PERSON C
- `docs/design/*` - PERSON C
- `docs/process/*` - PERSON C
- `specs/api/*` - PERSON C
- `specs/security/*` - PERSON A
- `specs/reporting/*` - PERSON B

## Integration Milestones

1. Phase 1 alignment review
   - PERSON C leads architecture review
   - PERSON A and PERSON B validate scope and constraints
2. Phase 2 module delivery
   - PERSON A delivers recon/scanner/remediation stubs
   - PERSON B delivers AI/reporting proof-of-concept
3. Phase 3 system integration
   - PERSON C integrates backend and frontend
   - Team performs first end-to-end run
4. Phase 4 verification
   - All team members execute the acceptance checklist
   - PERSON A validates scanning scope and fix actions
   - PERSON B validates AI findings and final report
5. Phase 5 demo readiness
   - PERSON C owns demo runbook
   - PERSON B validates narrative and report output
   - PERSON A confirms remediation agent behavior
