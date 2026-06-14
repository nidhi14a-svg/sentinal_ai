# Reporting Format Specification

## Report Output Formats
- PDF generated via ReportLab.
- HTML output rendered via WeasyPrint for preview and PDF conversion.

## Report Sections
- Executive Summary
- Target Information
- Reconnaissance Findings
- Vulnerability Findings
- AI Analysis and Remediation Plans
- Remediation Actions Taken
- Re-scan Results
- Conclusion and Next Steps

## Required Metadata
- `taskId`
- `domain`
- `scanTimestamp`
- `completedAt`
- `scanProfile`
- `reportVersion`

## File Storage
- Reports are stored in a `reports/` volume or artifact directory.
- Each report entry includes a stable URL or filesystem path.
- The backend must return a `reportUrl` for frontend download.
