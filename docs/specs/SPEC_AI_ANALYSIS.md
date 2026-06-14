# SPEC_AI_ANALYSIS

## 1. Purpose
Define the AI analysis subsystem for Sentinel AI, including Claude API integration, findings interpretation, and remediation recommendation generation.

## 2. Scope
- Translate scanner output into human-readable explanations.
- Generate prioritized remediation plans for each finding.
- Produce structured analysis output for frontend display and reporting.
- Exclude autonomous action without user consent.

## 3. Owner
PERSON B

## 4. Technologies Used
- Python
- Claude API
- requests

## 5. Inputs
- `targetDomain` (string)
- `reconSummary` (string)
- `normalizedFindings` (array)
- `scanProfile` (string)
- `scanMetadata` (object)

## 6. Outputs
- `analysisSummary` (string)
- `recommendations` (array)
- `confidenceNotes` (string)
- `recommendationSet` (array)
- `aiResponseMetadata` (object)

## 7. JSON Contracts
### Input contract
{
  "targetDomain": "example.team-owned-site.com",
  "reconSummary": "SSL certificate is valid and domain metadata is owned by the team.",
  "normalizedFindings": [
    {"findingId": "f-001", "title": "Missing security headers", "severity": "medium", "description": "...", "source": "ZAP"}
  ],
  "scanProfile": "full-scan"
}

### Output contract
{
  "analysisSummary": "The scan identified medium-risk header issues and an SSL configuration weakness.",
  "recommendations": [
    {"id": "r-001", "findingId": "f-001", "title": "Add security headers", "severity": "medium", "description": "Add Strict-Transport-Security and Content-Security-Policy headers.", "remediation": "Update Nginx config to include headers.", "estimatedEffort": "low"}
  ],
  "confidenceNotes": "Recommendations are based on scanner evidence and team-owned target policies.",
  "aiResponseMetadata": {"model": "claude-v1", "responseTimeMs": 320}
}

## 8. Interfaces
- Public method: `generate_analysis(target_domain, recon_summary, findings)`
- Claude wrapper: `ClaudeClient.send_analysis_prompt(payload)`
- Response parser: `parse_claude_response(raw_response)`
- Error interface: `AIAnalysisError`

## 9. Error Handling
- Claude API unavailable: `AIServiceUnavailableError`.
- Invalid response schema: `AIResponseFormatError`.
- Retryable API timeout: `AIServiceTimeoutError`.
- Rate limiting: `AIRateLimitError`.
- Fallback: return a minimal advisory response if analysis cannot be completed.

## 10. Testing Strategy
- Unit tests for prompt generation and response parsing.
- Mocked Claude API tests for success and failure cases.
- Schema validation tests for AI output contract.
- Integration tests with sample normalized findings.
- End-to-end tests verifying AI output can be consumed by frontend and reporting.

## 11. Acceptance Criteria
- AI analysis output matches the defined JSON contract.
- Explanations are clear and actionable.
- Recommendations are prioritized and mapped to scanner findings.
- Errors surface retryable vs non-retryable status.
- AI module does not block the orchestration pipeline if recoverable.

## 12. Integration Requirements
- Accept findings from `SPEC_VULNERABILITY_SCANNER.md`.
- Provide recommendations to `SPEC_FASTAPI_ORCHESTRATION.md` and `SPEC_FORENSIC_REPORT.md`.
- Support frontend display contracts in `SPEC_FRONTEND_DASHBOARD.md`.
- Log AI metadata for audit and debugging.
