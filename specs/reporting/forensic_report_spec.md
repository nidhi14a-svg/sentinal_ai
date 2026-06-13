# Forensic Report Specification

## Purpose
Define the structure and content of the final forensic report generated after remediation and re-scan.

## Report Components

### Executive Summary
- Brief summary of the scan scope and high-level results.
- Statement that the target is owned and controlled by the Sentinel AI team.

### Findings Breakdown
- Reconnaissance summary.
- Vulnerability findings with severity labels.
- AI-generated explanation for each finding.

### Remediation Plan
- Recommended fixes from Claude AI.
- Applied remediation actions.
- Remaining risks and follow-up verification steps.

### Re-scan Validation
- Outcome of the re-scan after remediation.
- Status of resolved vs unresolved items.

### Technical Appendices
- Raw scan artifact references.
- Audit trail entries for remediation actions.
- Claude output metadata and confidence notes.

## Reporting Acceptance
- Report must be exportable as PDF.
- The report must be accessible through a URL provided by the backend.
- The backend must persist the artifact path for future retrieval.
