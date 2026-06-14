# Scanning Scope Specification

## Allowed Target Policy
- Scans are only permitted on domains explicitly owned and controlled by the Sentinel AI team.
- The system must validate every requested domain against a configured allowlist.
- No arbitrary third-party websites may be scanned in version 1.

## Scan Types
- `recon-only`: DNS, WHOIS, SSL/TLS metadata, basic host enumeration.
- `full-scan`: OWASP ZAP, Nikto, ssl/sslyze vulnerability analysis.
- `audit-only`: analysis of existing findings without active scanning.

## Scanner Constraints
- OWASP ZAP API mode is used for integration.
- Nikto is used for web server vulnerability scanning only.
- No multi-vector attack simulation is performed.
- All scan activity must produce audit logs.

## Safety Controls
- Domain validation before any scan is executed.
- Fixed target list stored in secure backend configuration.
- Scanner component may be disabled if validation fails.
