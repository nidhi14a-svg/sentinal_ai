import time
from fastapi.testclient import TestClient
from backend.sentinel.api.main import app
from backend.sentinel.api.services.scan_service import ScanService

client = TestClient(app)


def test_initiate_scan_success():
    """Verify scanning can be initiated for a permitted domain."""
    payload = {
        "domain": "example.team-owned-site.com",
        "scanProfile": "audit-only"
    }
    response = client.post("/api/scan/initiate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "taskId" in data
    assert data["status"] == "queued"
    assert data["progress"] == 0

    task_id = data["taskId"]
    
    # Wait briefly for background orchestrate_workflow to run
    time.sleep(0.5)

    # Check status updates
    status_resp = client.get(f"/api/scan/{task_id}/status")
    assert status_resp.status_code == 200
    status_data = status_resp.json()
    assert status_data["taskId"] == task_id
    assert status_data["status"] in ("running", "analysis", "completed")

    # Check results
    results_resp = client.get(f"/api/scan/{task_id}/results")
    assert results_resp.status_code == 200
    results_data = results_resp.json()
    assert results_data["taskId"] == task_id
    assert results_data["domain"] == "example.team-owned-site.com"
    assert "reconData" in results_data
    assert "findings" in results_data
    assert "aiAnalysis" in results_data
    assert results_data["reportReady"] is False


def test_initiate_scan_unauthorized():
    """Verify scanner rejects non-allowlisted targets with 403."""
    payload = {
        "domain": "unauthorized-target.com",
        "scanProfile": "audit-only"
    }
    response = client.post("/api/scan/initiate", json=payload)
    assert response.status_code == 403
    assert "detail" in response.json()


def test_initiate_scan_validation_error():
    """Verify input validation errors return 422."""
    payload = {
        "scanProfile": "audit-only"
    }
    response = client.post("/api/scan/initiate", json=payload)
    assert response.status_code == 422


def test_get_status_not_found():
    """Verify status retrieval returns 404 for missing task."""
    response = client.get("/api/scan/task-not-existent/status")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_get_results_not_found():
    """Verify results retrieval returns 404 for missing task."""
    response = client.get("/api/scan/task-not-existent/results")
    assert response.status_code == 404


def test_fix_action_success():
    """Verify remediation fix endpoint can be invoked successfully."""
    # First create a task
    payload = {
        "domain": "example.team-owned-site.com",
        "scanProfile": "audit-only"
    }
    init_resp = client.post("/api/scan/initiate", json=payload)
    assert init_resp.status_code == 200
    task_id = init_resp.json()["taskId"]

    # Sleep to let workflow generate findings and AI recommendations
    time.sleep(0.5)

    # Call fix
    fix_payload = {
        "action": "fix",
        "recommendationId": "r-001"
    }
    fix_resp = client.post(f"/api/scan/{task_id}/fix", json=fix_payload)
    assert fix_resp.status_code == 200
    fix_data = fix_resp.json()
    assert fix_data["taskId"] == task_id
    assert fix_data["remediationStatus"] == "scheduled"

    # Wait for remediation thread to run
    time.sleep(0.5)

    # Retrieve status/results to verify completion or status
    status_resp = client.get(f"/api/scan/{task_id}/status")
    assert status_resp.status_code == 200


def test_fix_action_not_found():
    """Verify remediation endpoint returns 404 for missing task."""
    fix_payload = {
        "action": "fix",
        "recommendationId": "r-001"
    }
    response = client.post("/api/scan/task-not-existent/fix", json=fix_payload)
    assert response.status_code == 404


def test_generate_report_success():
    """Verify report generation updates task status and returns urls."""
    # Create task
    payload = {
        "domain": "example.team-owned-site.com",
        "scanProfile": "audit-only"
    }
    init_resp = client.post("/api/scan/initiate", json=payload)
    assert init_resp.status_code == 200
    task_id = init_resp.json()["taskId"]

    # Call report generate
    report_resp = client.post(f"/api/report/{task_id}/generate")
    assert report_resp.status_code == 200
    report_data = report_resp.json()
    assert report_data["taskId"] == task_id
    assert "reportUrl" in report_data
    assert "artifactPath" in report_data

    # Verify task results now show reportReady as true
    results_resp = client.get(f"/api/scan/{task_id}/results")
    assert results_resp.json()["reportReady"] is True


def test_generate_report_not_found():
    """Verify report generation endpoint returns 404 for missing task."""
    response = client.post("/api/report/task-not-existent/generate")
    assert response.status_code == 404
