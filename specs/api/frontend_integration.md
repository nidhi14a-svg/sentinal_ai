# Frontend Integration Specification

## Dashboard Requirements
- Domain entry and validation.
- Scan initiation controls.
- Real-time status updates.
- Findings summary and remediation actions.
- Final report access.

## Event Contract
- `scanInitiated(taskId)`
- `scanStatusUpdated(status)`
- `findingsLoaded(findings)`
- `fixActionTriggered(recommendationId)`
- `reportGenerated(reportUrl)`

## UX Data Shape
- Findings should include:
  - `findingId`
  - `title`
  - `severity`
  - `description`
  - `remediation`
  - `recommendationId`
- AI analysis should include:
  - `analysisSummary`
  - `confidenceNotes`
  - `recommendations`
