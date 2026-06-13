# Hackathon Demo Criteria

## Demo Goals
- Demonstrate a complete audit workflow for a controlled website.
- Show automated reconnaissance, vulnerability scanning, AI analysis, remediation, and final report generation.
- Keep the demo safe and within project constraints.

## Demo Checklist
- [x] User enters a valid domain owned by the team.
- [x] Scan initiation is visible in the React dashboard.
- [x] Reconnaissance and vulnerability findings are displayed.
- [x] AI analysis and remediation recommendations are shown.
- [x] `Fix` and `Fix All` actions can be triggered.
- [x] The system re-scans the target after remediation.
- [x] A final forensic report is generated and accessible.

## Demo Fallbacks
- If AI is unavailable, show a canned analysis summary.
- If remediation is not ready, highlight the planned fix steps and provide a safe review.
- Keep the live demo within a known 10-15 minute sequence.

---

## Verified Scanning Audit & Compliance Report

### 1. Scope Verification
- Permitted target domains are restricted to the configured allowlist (`sample_target/allowlist.txt`).
- Scan initiation attempts on unauthorized domains (e.g., `unauthorized-target.com`) correctly return `HTTP 403 Forbidden` (`TargetNotAllowedError`).

### 2. Orchestration Execution Paths
- Initiating a scan on `example.team-owned-site.com` successfully fires an asynchronous task lifecycle: `queued` -> `running` (recon & vulnerability scanner) -> `analysis` (AI recommendations) -> `completed`.
- Remediation fixes trigger an asynchronous remediation execution loop, which hardened Nginx configurations locally or executes remote commands safely.

### 3. Compliance and Security Validation
- All backend REST API payloads strictly conform to Pydantic and JSON spec contract schemas (`SPEC_FASTAPI_ORCHESTRATION.md`, `SPEC_VULNERABILITY_SCANNER.md`, and `SPEC_REMEDIATION_AGENT.md`).
- Live system verification tool (`verify_system.py`) completed all check phases successfully, ensuring API and integration flows are 100% compliant.

---

## Demo Execution Checklist (Handoff Runbook)

Use this checklist to perform the live hackathon demonstration successfully:

1. **Pre-Demo Environment Verification**:
   - Run system verification script:
     ```bash
     $env:PYTHONPATH="c:\Users\nidhi\Desktop\sential-ai"; python scripts/verify_system.py
     ```
   - Ensure the output displays `[SUCCESS] Sentinel AI Integrated Stack Verification completed successfully!`.
   - Confirm Docker Compose stack is running:
     ```bash
     docker compose ps
     ```

2. **Step 1: Scope Validation Demo**:
   - Attempt to scan `unauthorized-domain.com`.
   - Verify that the UI displays a "Target scope error: domain unauthorized" notification (HTTP 403 response).

3. **Step 2: Core Scan & AI Audit Narrative**:
   - Input `example.team-owned-site.com` and initiate scan.
   - Follow task status progression: `queued` -> `running` -> `analysis`.
   - Review the discovered vulnerabilities list (e.g. missing security headers).
   - Review AI-generated recommendations card showing descriptions and recommended fixes.

4. **Step 3: Remediation & Verification**:
   - Trigger the `Fix All` action.
   - Verify task status transitions to `remediation` and back to `completed`.
   - Check the `auditTrail` section of findings to confirm the remediation was successfully applied.
   - Click the generated report link to download the final forensic PDF.
