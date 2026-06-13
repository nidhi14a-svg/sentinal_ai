SAMPLE_SCANNER_OUTPUT = {
    "scan_id": "scan-1234",
    "domain": "example.team-owned-site.com",
    "scan_profile": "full-scan",
    "raw_findings": {
        "zap": [{"id": "ZAP-001", "description": "Missing security header."}],
        "nikto": [{"id": "NIKTO-001", "description": "Outdated server banner."}],
        "ssl": [{"id": "SSL-001", "description": "Weak cipher suite."}]
    },
    "normalized_findings": [
        {"finding_id": "f-001", "title": "Missing security headers", "severity": "medium", "description": "Response lacks strict transport security.", "source": "ZAP", "remediation_hint": "Update server headers."}
    ],
    "scanner_logs": ["scanner initialized", "zap completed", "nikto completed"],
    "completed_at": "2026-06-13T14:15:00Z"
}
