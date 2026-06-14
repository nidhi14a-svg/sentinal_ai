# Systems Overview

## Sentinel AI System Components

The Sentinel AI platform is composed of five main systems:

1. **User Interface**
   - React dashboard for scan submission, results review, and remediation controls.
2. **API Layer**
   - FastAPI service that exposes scan initiation and status endpoints.
3. **Reconnaissance Engine**
   - Collects domain, DNS, WHOIS, and SSL metadata.
4. **Vulnerability Scanner**
   - Executes OWASP ZAP and Nikto scans within a controlled scope.
5. **AI & Reporting Engine**
   - Uses Claude API to convert raw findings into actionable remediation and generates forensic reports.

## Key Design Principles
- Modular separation of concerns.
- Strict enforcement of controlled target scanning.
- Task-oriented orchestration with recoverable states.
- Clear contract-based integration between services.
- Demonstrable end-to-end workflow for hackathon presentation.
