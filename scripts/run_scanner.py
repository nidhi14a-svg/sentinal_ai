import sys
from backend.sentinel.scanner.services import ScannerService


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python run_scanner.py <domain> [profile]")
        sys.exit(1)
        
    domain = sys.argv[1]
    profile = sys.argv[2] if len(sys.argv) > 2 else "full-scan"
    
    print(f"Triggering scanner subsystem for domain: {domain} using profile: {profile}")
    try:
        # Construct conforming recon data metadata
        recon_data = {
            "targetDomain": domain,
            "isAllowedTarget": True,
            "dnsRecords": {},
            "whoisData": {},
            "sslCertificate": {},
            "reconSummary": "Recon placeholder for CLI scanner run.",
        }
        res = ScannerService().execute_scan(domain, profile, recon_data)
        print("Scanner run completed successfully.")
        print(f"Scan ID: {res['scanId']}")
        print(f"Findings found: {len(res['normalizedFindings'])}")
        for f in res['normalizedFindings']:
            print(f" - [{f['severity'].upper()}] {f['title']}: {f['description']}")
    except Exception as e:
        print(f"Scanner run failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
