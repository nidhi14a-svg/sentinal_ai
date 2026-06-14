# SPEC_REMEDIATION_AGENT

## 1. Purpose
Define the remediation agent subsystem for Sentinel AI, including the application of fixes and audit history for controlled targets.

## 2. Scope
- Apply verified remediation recommendations to team-owned infrastructure.
- Support `Fix` and `Fix All` operations.
- Provide audit logs and remediation status details.
- Exclude unauthorized or destructive changes.

## 3. Owner
PERSON A

## 4. Technologies Used
- Python
- SSH automation
- Nginx configuration management
- requests

## 5. Inputs
- `taskId` (string)
- `targetDomain` (string)
- `recommendationSet` (array)
- `action` (string) - `fix` or `fix-all`
- `approvalContext` (object)

## 6. Outputs
- `remediationStatus` (string)
- `remediationActions` (array)
- `auditTrail` (array)
- `completedAt` (string)
- `errorDetails` (object, optional)

## 7. JSON Contracts
### Input contract
{
  "taskId": "task-1234",
  "targetDomain": "example.team-owned-site.com",
  "action": "fix",
  "recommendationSet": [
    {"id": "r-001", "findingId": "f-001", "remediation": "Update Nginx config"}
  ],
  "approvalContext": {"userConfirmed": true}
}

### Output contract
{
  "remediationStatus": "completed",
  "remediationActions": [
    {"recommendationId": "r-001", "status": "applied", "details": "Nginx header config updated."}
  ],
  "auditTrail": [
    {"timestamp": "2026-06-13T14:30:00Z", "action": "apply_fix", "recommendationId": "r-001", "status": "success"}
  ],
  "completedAt": "2026-06-13T14:32:00Z"
}

## 8. Interfaces
- Public method: `execute_remediation(task_id, action, recommendations, target_details)`
- Approval guard: `validate_remediation_approval(approval_context)`
- Action executor: `apply_remediation_action(recommendation)`
- Audit logger: `record_audit_entry(entry)`
- Error interface: `RemediationError`

## 9. Error Handling
- Approval missing: `RemediationApprovalError`.
- Unsupported recommendation: `UnsupportedRemediationError`.
- Execution failure: `RemediationExecutionError`.
- Partial success: return `remediationStatus: "partial"` with failed action details.
- Unauthorized target: `RemediationTargetNotAllowedError`.

## 10. Testing Strategy
- Unit tests for approval and action validation.
- Mocked SSH / Nginx operations for successful and failed remediation.
- Contract tests for resulting audit trail format.
- Negative tests for unsupported or unapproved remediation requests.
- Integration tests verifying that remediation status flows into the orchestration layer.

## 11. Acceptance Criteria
- Only approved remediation actions are executed.
- Outputs include a complete audit trail and status summary.
- Action failure conditions are reported without losing previous success data.
- The subsystem respects the controlled target scope.
- Remediation results are consumable by reporting and frontend modules.

## 12. Integration Requirements
- Consume recommendation sets from `SPEC_AI_ANALYSIS.md`.
- Report remediation status to `SPEC_FASTAPI_ORCHESTRATION.md`.
- Provide audit trail entries for `SPEC_FORENSIC_REPORT.md`.
- Coordinate re-scan triggers after remediation is complete.
