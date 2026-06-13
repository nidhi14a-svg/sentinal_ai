SAMPLE_RECON_OUTPUT = {
    "target_domain": "example.team-owned-site.com",
    "is_allowed_target": True,
    "dns_records": {"A": ["203.0.113.10"], "MX": ["mail.example.com"]},
    "whois_data": {"registrar": "Example Registrar", "creation_date": "2024-01-01"},
    "ssl_certificate": {"issuer": "Let\u2019s Encrypt", "valid_from": "2024-05-01", "valid_to": "2025-05-01"},
    "discovered_services": ["https", "http"],
    "recon_summary": "Controlled target is valid and presents expected service endpoints.",
    "timestamp": "2026-06-13T14:00:00Z"
}
