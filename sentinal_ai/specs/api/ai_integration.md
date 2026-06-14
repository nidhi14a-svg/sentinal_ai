# AI Integration Specification

## Claude API Contract

### Input Schema
- `targetDomain` (string)
- `scanSummary` (string)
- `reconData` (object)
- `findings` (array of objects)
- `scanContext` (string)

### Desired Output
- `analysisSummary` (string)
- `recommendations` (array)
  - `id` (string)
  - `findingId` (string)
  - `title` (string)
  - `severity` (string)
  - `description` (string)
  - `remediation` (string)
  - `estimatedEffort` (string)
- `confidenceNotes` (string)

### Behavior Requirements
- Explain security issues in plain language.
- Provide prioritized remediation guidance.
- Avoid suggesting unauthorized external actions.
- Provide verification and follow-up checks.

## Error Contract
- `errorCode` (string)
- `message` (string)
- `retryable` (boolean)
