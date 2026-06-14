import sys
from backend.sentinel.remediation.services import RemediationService


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python run_remediation.py <domain> [action]")
        sys.exit(1)
        
    domain = sys.argv[1]
    action = sys.argv[2] if len(sys.argv) > 2 else "fix-all"
    
    print(f"Triggering remediation agent for domain: {domain} using action: {action}")
    try:
        recommendations = [
            {
                "id": "r-001",
                "findingId": "f-001",
                "title": "Add security headers",
                "type": "header_hardening",
                "remediation": "Update Nginx config to include headers."
            }
        ]
        target_details = {
            "targetDomain": domain,
            "approvalContext": {"userConfirmed": True},
            "dryRun": True,  # Default to dryRun for safety via CLI
            "verification": False,
        }
        res = RemediationService().execute_remediation(
            task_id="cli-task-0001",
            action=action,
            recommendations=recommendations,
            target_details=target_details
        )
        print("Remediation execution completed successfully.")
        print(f"Status: {res['remediationStatus']}")
        print("Actions executed:")
        for act in res['remediationActions']:
            print(f" - [{act['recommendationId']}] status: {act['status']}, details: {act['details']}")
    except Exception as e:
        print(f"Remediation execution failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
