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
