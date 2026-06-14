# Sequence Diagrams and Workflow

## High-Level Workflow

1. User enters and submits a domain.
2. React frontend calls `POST /api/scan/initiate`.
3. FastAPI validates the domain and creates a task.
4. Orchestrator triggers reconnaissance and scanning modules.
5. Scanner results are aggregated and sent to Claude AI.
6. Claude returns analysis and remediation recommendations.
7. Frontend displays findings and remediation actions.
8. User selects `Fix` or `Fix All`.
9. Remediation agent applies guided fixes.
10. System re-scans and generates the final report.

## Failure and Retry Flow
- If Claude API fails, the system surfaces a retry option.
- If scanner integration fails, the task status moves to `failed` with diagnostic logs.
- Remediation actions are gated behind user intent and safe domain validation.
