# Sentinel AI API Contracts

## Backend API Contract

### `POST /api/scan/initiate`
- Description: Start a scan job for a controlled target domain.
- Request:
  - `domain` (string) - target domain owned by the team.
  - `scanProfile` (string) - `recon-only`, `full-scan`, or `audit-only`.
- Response:
  - `taskId` (string)
  - `status` (string) - `queued`
  - `startedAt` (string, ISO8601)

### `GET /api/scan/{taskId}/status`
- Description: Retrieve scan task status.
- Response:
  - `taskId` (string)
  - `status` (string) - `queued`, `running`, `analysis`, `remediation`, `completed`, `failed`
  - `currentStep` (string)
  - `progress` (integer, 0-100)

### `GET /api/scan/{taskId}/results`
- Description: Retrieve scan findings and AI analysis.
- Response:
  - `taskId` (string)
  - `domain` (string)
  - `reconData` (object)
  - `findings` (array)
  - `aiAnalysis` (object)
  - `reportReady` (boolean)

### `POST /api/scan/{taskId}/fix`
- Description: Apply a single remediation recommendation or all fixes.
- Request:
  - `taskId` (string)
  - `action` (string) - `fix`, `fix-all`
  - `recommendationId` (string, optional)
- Response:
  - `taskId` (string)
  - `remediationStatus` (string) - `scheduled`, `in-progress`, `completed`, `failed`

### `POST /api/report/{taskId}/generate`
- Description: Generate a final forensic report.
- Response:
  - `taskId` (string)
  - `reportUrl` (string)
  - `artifactPath` (string)

## Frontend Integration Contract

- `scanInitiated(taskId)` - frontend navigates to scan status view.
- `scanStatusUpdated(status)` - status refresh event.
- `findingsLoaded(findings)` - display vulnerability list.
- `fixActionTriggered(recommendationId)` - call fix endpoint.
- `reportGenerated(reportUrl)` - open final report.

## AI Integration Contract

### Request to Claude API
- Prompt input must include:
  - `targetDomain`
  - `scanSummary`
  - `vulnerabilities` list
  - `reconSummary`
- Required behavior:
  - Provide a concise explanation for each finding.
  - Provide remediation steps in priority order.
  - Identify return-to-production risks and verification checks.

### Expected Claude Response Schema
- `analysisSummary` (string)
- `recommendations` (array of objects)
  - `id` (string)
  - `findingId` (string)
  - `title` (string)
  - `severity` (string)
  - `description` (string)
  - `remediation` (string)
  - `estimatedEffort` (string)
- `confidenceNotes` (string)

### Error Handling
- AI failures return structured error payload:
  - `errorCode` (string)
  - `message` (string)
  - `retryable` (boolean)

## Internal Module Contract

### Orchestration to Scanner
- Request:
  - `domain`
  - `scanTasks` list
  - `controlledTarget` metadata
- Response:
  - `reconData`
  - `rawFindings`
  - `scannerLog`

### Orchestration to Remediation Agent
- Request:
  - `taskId`
  - `recommendationSet`
  - `targetDetails`
- Response:
  - `remediationActions`
  - `status`
  - `auditTrail`

## Safety Contract

- Every endpoint must validate that the domain belongs to the controlled target allowlist.
- No arbitrary third-party domains may be accepted in version 1.
- Scan and remediation actions are logged per task.
