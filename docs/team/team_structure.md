# Team Structure and Scope

## Sentinel AI Hackathon Team

### PERSON A
- Focus: Domain reconnaissance, vulnerability scanning, remediation automation.
- Responsibilities:
  - Build and validate scanning modules for controlled targets.
  - Integrate OWASP ZAP, Nikto, dnspython, and sslyze.
  - Define remediation workflows for fix actions.

### PERSON B
- Focus: AI analysis, remediation planning, report generation.
- Responsibilities:
  - Define Claude AI prompt templates and response parsing.
  - Generate remediation plans and explanations.
  - Create forensic report schemas and PDF/HTML rendering.

### PERSON C
- Focus: Product orchestration, backend APIs, frontend experience.
- Responsibilities:
  - Design and implement the FastAPI orchestration layer.
  - Build the React dashboard and user interaction flows.
  - Manage integration and demo readiness.

## Collaboration Model
- PERSON C designs the integration contracts and workflows.
- PERSON A and PERSON B implement independent modules against those contracts.
- Team sync points:
  - Architecture review at Phase 1 completion.
  - API contract validation before integration.
  - Weekly progress checkpoints aligned to hackathon milestones.
