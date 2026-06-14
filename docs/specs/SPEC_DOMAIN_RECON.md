# SPEC_DOMAIN_RECON

## 1. Purpose
Define the domain reconnaissance subsystem for Sentinel AI, including data collection, validation, and controlled-target verification.

## 2. Scope
- Discover DNS, WHOIS, SSL/TLS, and host metadata for a target domain.
- Validate that the domain belongs to the team-owned allowlist.
- Provide structured output for subsequent scanner and AI modules.
- Exclude active vulnerability exploitation and attack simulation.

## 3. Owner
PERSON A

## 4. Technologies Used
- Python
- dnspython
- python-whois
- requests
- ssl
- sslyze

## 5. Inputs
- `domain` (string)
- `allowlist` or `controlledTargetConfig` (object)
- `scanProfile` (string)

## 6. Outputs
- `targetDomain` (string)
- `isAllowedTarget` (boolean)
- `dnsRecords` (object)
- `whoisData` (object)
- `sslCertificate` (object)
- `discoveredServices` (array)
- `reconSummary` (string)
- `timestamp` (string)

## 7. JSON Contracts
### Input contract
{
  "domain": "example.team-owned-site.com",
  "scanProfile": "recon-only"
}

### Output contract
{
  "targetDomain": "example.team-owned-site.com",
  "isAllowedTarget": true,
  "dnsRecords": {"A": ["203.0.113.10"], "MX": ["mail.example.com"]},
  "whoisData": {"registrar": "Example Registrar", "creationDate": "2024-01-01"},
  "sslCertificate": {"issuer": "Let\u2019s Encrypt", "validFrom": "2024-05-01", "validTo": "2025-05-01"},
  "discoveredServices": ["https", "http"],
  "reconSummary": "Domain is validated as a controlled target with valid TLS and expected DNS records.",
  "timestamp": "2026-06-13T14:00:00Z"
}

## 8. Interfaces
- Public method: `run_recon(domain, scan_profile)`
- Domain validation helper: `verify_allowed_domain(domain, allowlist)`
- Data adapter: `build_recon_payload(recon_data)`
- Error interface: `DomainReconError`

## 9. Error Handling
- Invalid domain format: return `InvalidDomainError`.
- Domain not in allowlist: return `TargetNotAllowedError`.
- DNS lookup failure: return `DnsLookupError` with `retryable=true`.
- Whois failure: return `WhoisLookupError`.
- SSL inspection failure: return `SslInspectionError`.
- Unexpected exceptions: return `DomainReconUnexpectedError`.

## 10. Testing Strategy
- Unit tests for domain allowlist validation.
- Mocked DNS and WHOIS responses for expected data shapes.
- Negative tests for invalid domains and blocked hosts.
- Integration tests with a controlled target stub or local DNS fixture.
- End-to-end validation that output matches the JSON contract.

## 11. Acceptance Criteria
- Domain verification rejects non-allowlisted domains.
- Recon output includes DNS, WHOIS, and SSL artifacts.
- `isAllowedTarget` is correctly set for controlled target domains.
- No active scanning or exploitation is performed.
- The subsystem exposes stable JSON output for the orchestration layer.

## 12. Integration Requirements
- Provide `reconPayload` to `backend/orchestration/`.
- Must integrate with `SPEC_FASTAPI_ORCHESTRATION.md` contract for scanning tasks.
- Must expose structured output for AI analysis and reporting modules.
- Must log validation decisions for compliance and audit.
