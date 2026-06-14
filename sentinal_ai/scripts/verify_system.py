import sys
from fastapi.testclient import TestClient
from backend.sentinel.api.main import app


def main() -> None:
    print("Starting Sentinel AI System Verification...")
    client = TestClient(app)
    
    # 1. Health Check
    health = client.get("/health")
    if health.status_code != 200 or health.json().get("status") != "ok":
        print("[-] Health Check failed!")
        sys.exit(1)
    print("[+] Health Check passed.")

    # 2. Allowlist Target Check
    unauth = client.post("/api/scan/initiate", json={"domain": "unauthorized.com", "scanProfile": "audit-only"})
    if unauth.status_code != 403:
        print("[-] Target scope check failed! Allowed unauthorized domains.")
        sys.exit(1)
    print("[+] Target scope check passed (403 returned for unauthorized domains).")

    # 3. Scan Lifecycle Integration Check
    payload = {"domain": "example.team-owned-site.com", "scanProfile": "audit-only"}
    initiate = client.post("/api/scan/initiate", json=payload)
    if initiate.status_code != 200:
        print(f"[-] Scan initiation failed: {initiate.text}")
        sys.exit(1)
    
    task_id = initiate.json().get("taskId")
    print(f"[+] Scan initiated successfully. Task ID: {task_id}")

    # 4. Status updates
    status = client.get(f"/api/scan/{task_id}/status")
    if status.status_code != 200 or status.json().get("taskId") != task_id:
        print("[-] Status retrieval failed!")
        sys.exit(1)
    print(f"[+] Status retrieval passed. Initial status: {status.json().get('status')}")

    # 5. Fix action and Audit Trail Check
    fix_res = client.post(f"/api/scan/{task_id}/fix", json={"action": "fix", "recommendationId": "r-001"})
    if fix_res.status_code != 200 or fix_res.json().get("remediationStatus") != "scheduled":
        print("[-] Remediation triggering failed!")
        sys.exit(1)
    print("[+] Remediation fix action scheduled successfully.")

    # 6. Report generation check
    report = client.post(f"/api/report/{task_id}/generate")
    if report.status_code != 200:
        print(f"[-] Report generation failed: {report.text}")
        sys.exit(1)
    print(f"[+] Report generated successfully. URL: {report.json().get('reportUrl')}")

    print("\n[SUCCESS] Sentinel AI Integrated Stack Verification completed successfully!")


if __name__ == "__main__":
    main()
