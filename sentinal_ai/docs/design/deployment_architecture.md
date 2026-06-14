# Deployment Architecture

## Docker Compose Architecture

The initial deployment is designed for local or team infrastructure using Docker Compose:

- `frontend` container running the React dashboard.
- `backend` container running FastAPI.
- Optional `zap` container for OWASP ZAP API mode.
- Optional `scanner` volume for persisted scan artifacts.
- `reports` volume for PDF/HTML report storage.

## Runtime Environment
- The backend exposes REST APIs on a defined port.
- The frontend consumes backend endpoints through environment configuration.
- Scanner engines are either local processes or containerized services.
- AI calls are outbound to Claude API from the backend.

## Safety Guardrails
- The deployment includes an allowlist for valid domains.
- Scanner services are only enabled when the target passes validation.
- Docker networking is isolated to the local compose network.

---

## Live Remediation Story & Fallback Plan

### Demo Narrative Flow (The Live Remediation Story)
1. **Domain Input**: The presenter types `example.team-owned-site.com` in the domain input box.
2. **First Scan**: Initiating the scan performs a live port check, SSL handshake, DNS resolution, and ZAP/Nikto vulnerability inspection.
3. **Audit Findings**: The scanner alerts on the lack of standard HTTP security headers and deprecated TLS v1/v1.1 configurations on Nginx.
4. **AI recommendation**: Claude reads the findings list and output-prioritized remediation cards on the screen with estimated developer efforts.
5. **Remediation action**: The presenter clicks `Fix All`. The React UI posts a fix request, prompting the backend remediation agent.
6. **Configuration Hardening**: The agent checks the allowlist safety bounds and directly appends headers and secure TLS settings into the target's `nginx.conf`.
7. **Re-Scan & Report**: The system starts a validation re-scan, resolving all findings and unlocking the Forensic PDF Report download.

### Demo Fallback Procedures (The Fallback Plan)
- **Local Sandbox Fallback**: If internet connectivity drops or Claude API times out, the backend defaults to the mock AI Analysis client, which provides structured canned suggestions without blocking the presenter.
- **Dry-run Mode Fallback**: If the Nginx file permissions are read-only, the system executes in `dry_run` mode, logging Nginx config edits and audit trail changes without altering config files.
- **Service Isolation**: If a scanner engine container (ZAP/Nikto) is offline, the backend catches the API exception gracefully, returns a warning logs payload, and proceeds with available recon findings.
