# Backend API Specification

## Purpose
Define the FastAPI backend contract for scan orchestration, status tracking, remediation, and reporting.

## Endpoints

### `POST /api/scan/initiate`
- Inputs:
  - `domain` (string)
  - `scanProfile` (string)
- Outputs:
  - `taskId` (string)
  - `status` (string)

### `GET /api/scan/{taskId}/status`
- Outputs:
  - `taskId` (string)
  - `status` (string)
  - `progress` (integer)
  - `currentStep` (string)

### `GET /api/scan/{taskId}/results`
- Outputs:
  - `domain` (string)
  - `reconData` (object)
  - `findings` (array)
  - `aiAnalysis` (object)
  - `reportReady` (boolean)

### `POST /api/scan/{taskId}/fix`
- Inputs:
  - `action` (string)
  - `recommendationId` (string, optional)
- Outputs:
  - `remediationStatus` (string)

### `POST /api/report/{taskId}/generate`
- Outputs:
  - `reportUrl` (string)
  - `artifactPath` (string)
