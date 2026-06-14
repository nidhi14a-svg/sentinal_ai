# Remediation Workflow Specification

## Objective
Define how the remediation agent applies fixes safely for the controlled target.

## Inputs
- `taskId` (string)
- `recommendationSet` (array of remediation objects)
- `targetDetails` (object)
- `approvalMode` (string) - `single` or `all`

## Outputs
- `remediationActions` (array)
- `status` (string)
- `auditTrail` (array)

## Behavior
- Remediation is only executed after user confirmation.
- Each remediation step is logged and timestamped.
- If a remediation step fails, the workflow must stop and return a failure state.
- Remediation actions must be scoped to infrastructure owned by the team.

## Example Actions
- Update Nginx configuration.
- Apply TLS configuration fixes.
- Fix misconfigured headers or insecure settings.
- Generate a follow-up scan task after remediation.
