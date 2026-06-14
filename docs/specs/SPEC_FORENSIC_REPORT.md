# SPEC_FORENSIC_REPORT

## 1. Purpose
Define the forensic report subsystem for Sentinel AI, including report content, rendering formats, and storage.

## 2. Scope
- Generate a final forensic report after scan and remediation.
- Include executive summary, findings, AI analysis, remediation actions, and re-scan results.
- Render output as PDF and HTML preview-ready content.
- Exclude operational dashboards and unrelated metrics.

## 3. Owner
PERSON B

## 4. Technologies Used
- Python
- ReportLab
- WeasyPrint

## 5. Inputs
- `taskId` (string)
- `domain` (string)
- `scanMetadata` (object)
- `reconData` (object)
- `findings` (array)
- `aiAnalysis` (object)
- `remediationActions` (array)
- `reScanResults` (object)

## 6. Outputs
- `reportId` (string)
- `reportUrl` (string)
- `artifactPath` (string)
- `generatedAt` (string)
- `reportSummary` (string)

## 7. JSON Contracts
### Input contract
{
  "taskId": "task-1234",
  "domain": "example.team-owned-site.com",
  "scanMetadata": {"scanProfile": "full-scan", "startedAt": "..."},
  "reconData": {...},
  "findings": [...],
  "aiAnalysis": {...},
  "remediationActions": [...],
  "reScanResults": {...}
}

### Output contract
{
  "reportId": "report-1234",
  "reportUrl": "http://localhost:8000/reports/report-1234.pdf",
  "artifactPath": "/app/reports/report-1234.pdf",
  "generatedAt": "2026-06-13T14:45:00Z",
  "reportSummary": "Forensic report generated for example.team-owned-site.com, including remediation validation."
}

## 8. Interfaces
- Public method: `generate_report(report_payload)`
- Renderer: `render_pdf(report_model)`
- HTML generator: `render_html(report_model)`
- Storage interface: `persist_report_artifact(path, content)`
- Error interface: `ReportGenerationError`

## 9. Error Handling
- Rendering failure: `ReportRenderingError`.
- Storage failure: `ReportStorageError`.
- Invalid report payload: `ReportPayloadValidationError`.
- Partial report generation: return error details with failed stage.

## 10. Testing Strategy
- Unit tests for report model validation.
- Template tests for expected section rendering.
- Mocked ReportLab / WeasyPrint runs for success and failure.
- Integration tests ensuring report URLs and artifact paths are returned.
- Validation tests for PDF access and file existence in artifact storage.

## 11. Acceptance Criteria
- Final report includes all required sections.
- PDF is generated and accessible through a URL.
- Artifact path is persisted and returned by the backend.
- Report generation handles missing optional data gracefully.
- The report format is consistent with the breach response workflow.

## 12. Integration Requirements
- Accept completed data from `SPEC_FASTAPI_ORCHESTRATION.md`.
- Consume `aiAnalysis` from `SPEC_AI_ANALYSIS.md`.
- Include remediation audit trail from `SPEC_REMEDIATION_AGENT.md`.
- Provide report artifact reference to the frontend display contract in `SPEC_FRONTEND_DASHBOARD.md`.
