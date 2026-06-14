import uuid
import threading
from datetime import datetime
from typing import Any, Optional

from ...recon.services import ReconService
from ...recon.exceptions import TargetNotAllowedError, InvalidDomainError
from ...scanner.services import ScannerService
from ...remediation.services import RemediationService
from ...ai_analysis.services import AIAnalysisService
from ..exceptions import ApiValidationError, TaskNotFoundError, OrchestrationError
from ..schemas.scan import ScanInitiateRequest, FixRequest
from .task_persistence import TaskPersistenceManager


class ScanService:
    """Backend scan orchestration service."""

    # Class-level dictionary to store tasks in memory
    _tasks: dict[str, dict[str, Any]] = {}
    
    # Initialize persistence manager
    _persistence = TaskPersistenceManager()

    def create_scan_task(self, payload: Any = None, domain: str = None, scan_profile: str = None) -> dict[str, Any]:
        """Initiate a scan task for a controlled target domain."""
        if payload is not None:
            if isinstance(payload, ScanInitiateRequest):
                dom = payload.domain
            else:
                dom = payload.get("domain")
        else:
            dom = domain
        prof = "full-scan" # Forced

        if not dom:
            raise ApiValidationError("Domain must be provided")

        # Validate that the target domain is allowed
        recon_service = ReconService()
        try:
            if not recon_service.is_allowed_target(dom):
                raise TargetNotAllowedError(f"Target domain '{dom}' is not allowed by allowlist")
        except Exception as exc:
            if isinstance(exc, TargetNotAllowedError):
                raise exc
            raise TargetNotAllowedError(f"Could not validate target domain: {exc}")

        task_id = f"task-{uuid.uuid4()}"
        started_at = datetime.utcnow().isoformat() + "Z"

        task = {
            "taskId": task_id,
            "domain": dom,
            "scanProfile": prof,
            "status": "queued",
            "currentStep": "recon",
            "progress": 0,
            "startedAt": started_at,
            "reconData": {},
            "findings": [],
            "aiAnalysis": {
                "analysisSummary": "",
                "confidenceNotes": "",
                "recommendations": []
            },
            "reportReady": False,
            "remediationStatus": None,
            "remediationActions": [],
            "auditTrail": []
        }

        self._tasks[task_id] = task
        # Persist task to database
        self._persistence.save_task(task_id, task)

        # Start workflow orchestrator in a background daemon thread
        threading.Thread(
            target=self.orchestrate_workflow,
            args=(task_id,),
            daemon=True
        ).start()

        return {
            "taskId": task_id,
            "status": "queued",
            "currentStep": "recon",
            "progress": 0,
            "startedAt": started_at
        }

    def get_scan_status(self, task_id: str) -> dict[str, Any]:
        """Retrieve scan task status."""
        if task_id not in self._tasks:
            # Try to load from persistence
            task = self._persistence.get_task(task_id)
            if task:
                self._tasks[task_id] = task
            else:
                raise TaskNotFoundError(f"Task {task_id} not found")
        task = self._tasks[task_id]
        return {
            "taskId": task_id,
            "status": task["status"],
            "currentStep": task["currentStep"],
            "progress": task["progress"]
        }

    def get_scan_results(self, task_id: str) -> dict[str, Any]:
        """Retrieve scan findings and AI analysis."""
        if task_id not in self._tasks:
            # Try to load from persistence
            task = self._persistence.get_task(task_id)
            if task:
                self._tasks[task_id] = task
            else:
                raise TaskNotFoundError(f"Task {task_id} not found")
        task = self._tasks[task_id]
        return {
            "taskId": task_id,
            "domain": task["domain"],
            "reconData": task["reconData"],
            "findings": task["findings"],
            "aiAnalysis": task["aiAnalysis"],
            "reportReady": task["reportReady"]
        }

    def process_fix_action(self, task_id: str, payload: Any = None, action: str = None, recommendation_id: str = None) -> dict[str, Any]:
        """Apply a single remediation recommendation or all fixes."""
        if task_id not in self._tasks:
            # Try to load from persistence
            task = self._persistence.get_task(task_id)
            if task:
                self._tasks[task_id] = task
            else:
                raise TaskNotFoundError(f"Task {task_id} not found")

        # Extract parameters
        if payload is not None:
            if isinstance(payload, FixRequest):
                act = payload.action
                rec_id = payload.recommendationId
            else:
                act = payload.get("action")
                rec_id = payload.get("recommendationId")
        else:
            act = action
            rec_id = recommendation_id

        # Update status
        self._tasks[task_id]["remediationStatus"] = "scheduled"

        # Start background thread
        threading.Thread(
            target=self.orchestrate_remediation,
            args=(task_id, act, rec_id),
            daemon=True
        ).start()

        return {
            "taskId": task_id,
            "remediationStatus": "scheduled"
        }

    def get_remediation_status(self, task_id: str) -> dict[str, Any]:
        """Get remediation progress and actions."""
        if task_id not in self._tasks:
            task = self._persistence.get_task(task_id)
            if task:
                self._tasks[task_id] = task
            else:
                raise TaskNotFoundError(f"Task {task_id} not found")
        
        task = self._tasks[task_id]
        return {
            "taskId": task_id,
            "remediationStatus": task.get("remediationStatus", "pending"),
            "remediationActions": task.get("remediationActions", []),
            "auditTrail": task.get("auditTrail", []),
            "completedAt": task.get("completedAt")
        }

    def process_remediation(self, task_id: str, action: str, recommendation_id: Optional[str] = None) -> dict[str, Any]:
        """Spec-compliant process_remediation method."""
        return self.process_fix_action(task_id, action=action, recommendation_id=recommendation_id)

    def generate_report(self, task_id: str) -> dict[str, Any]:
        """Generate a final report for a task."""
        if task_id not in self._tasks:
            # Try to load from persistence
            task = self._persistence.get_task(task_id)
            if task:
                self._tasks[task_id] = task
            else:
                raise TaskNotFoundError(f"Task {task_id} not found")
        
        # GUARD: Report can only be generated if scan is completed
        task = self._tasks[task_id]
        if task["status"] not in ["completed", "remediation"]:
            raise ApiValidationError(
                f"Cannot generate report: scan is still {task['status']}. "
                f"Please wait for scan to complete before generating report."
            )
        
        self._tasks[task_id]["reportReady"] = True
        # Persist updated task
        self._persistence.save_task(task_id, self._tasks[task_id])
        
        from .report_service import ReportService
        return ReportService().generate_report(task_id)

    def orchestrate_workflow(self, task_id: str) -> None:
        """Background thread executing the orchestration workflow: recon -> scanner -> ai_analysis."""
        try:
            task = self._tasks.get(task_id)
            if not task:
                return

            domain = task["domain"]
            profile = task["scanProfile"]

            # STEP 1: Reconnaissance
            task["status"] = "running"
            task["currentStep"] = "recon"
            task["progress"] = 10

            recon_service = ReconService()
            if profile == "audit-only":
                recon_data = recon_service.run(domain, profile, verification=True)
            else:
                recon_data = recon_service.run_recon(domain, profile)

            task["reconData"] = recon_data
            task["progress"] = 30
            # Persist progress
            self._persistence.save_task(task_id, task)

            # STEP 2: Scanner (Vulnerability Scanner)
            if profile == "recon-only":
                # Skip scanner & AI analysis
                task["status"] = "completed"
                task["currentStep"] = None
                task["progress"] = 100
                task["completedAt"] = datetime.utcnow().isoformat() + "Z"
                # Persist completed task
                self._persistence.save_task(task_id, task)
                return

            task["currentStep"] = "scanner"
            task["progress"] = 40

            scanner_service = ScannerService()
            if profile == "audit-only":
                scan_res = scanner_service.execute(domain, profile, metadata={}, verification=True)
            else:
                scan_res = scanner_service.execute_scan(domain, profile, recon_data)

            # Get normalized findings
            task["findings"] = scan_res.get("normalizedFindings") or scan_res.get("normalized_findings") or []
            task["progress"] = 60
            # Persist findings
            self._persistence.save_task(task_id, task)

            # STEP 3: AI Analysis
            task["status"] = "analysis"
            task["currentStep"] = "ai_analysis"
            task["progress"] = 70

            ai_service = AIAnalysisService()
            recon_summary = recon_data.get("reconSummary") or recon_data.get("recon_summary") or ""
            
            ai_res = ai_service.generate_analysis(domain, recon_summary, task["findings"])
            task["aiAnalysis"] = ai_res

            # Map recommendation ID back to findings
            recommendations = ai_res.get("recommendations", [])
            rec_map = {rec["findingId"]: rec["id"] for rec in recommendations if "findingId" in rec}
            for f in task["findings"]:
                f["recommendationId"] = rec_map.get(f.get("findingId"))

            task["progress"] = 90
            # Persist AI analysis
            self._persistence.save_task(task_id, task)

            # STEP 4: Completed
            task["status"] = "completed"
            task["currentStep"] = None
            task["progress"] = 100
            task["completedAt"] = datetime.utcnow().isoformat() + "Z"
            # Persist completed task
            self._persistence.save_task(task_id, task)

        except Exception as exc:
            import traceback
            traceback.print_exc()
            # Mark task as failed
            if task_id in self._tasks:
                self._tasks[task_id]["status"] = "failed"
                self._tasks[task_id]["currentStep"] = None
                self._tasks[task_id]["progress"] = 100
                self._tasks[task_id]["error"] = str(exc)
                # Persist failed task
                self._persistence.save_task(task_id, self._tasks[task_id])

    def orchestrate_remediation(self, task_id: str, action: str, recommendation_id: Optional[str] = None) -> None:
        """Background thread executing the remediation steps."""
        try:
            task = self._tasks.get(task_id)
            if not task:
                return

            task["status"] = "remediation"
            task["currentStep"] = "remediation"
            task["progress"] = 90

            # Gather recommendations
            all_recs = task.get("aiAnalysis", {}).get("recommendations", [])
            if action == "fix":
                recs = [r for r in all_recs if r.get("id") == recommendation_id]
                if not recs:
                    # Fallback lookup by recommendationId
                    recs = [r for r in all_recs if r.get("recommendationId") == recommendation_id]
            else:
                recs = all_recs

            target_details = {
                "targetDomain": task["domain"],
                "approvalContext": {"userConfirmed": True},
                "dryRun": False,
                "verification": True if task["scanProfile"] == "audit-only" else False,
                "targetHost": None
            }

            remediation_service = RemediationService()
            rem_res = remediation_service.execute_remediation(
                task_id=task_id,
                action=action,
                recommendations=recs,
                target_details=target_details
            )

            # Update task state with remediation status & results
            task["remediationStatus"] = rem_res.get("remediationStatus") or "completed"
            task["remediationActions"] = rem_res.get("remediationActions") or []
            task["auditTrail"] = rem_res.get("auditTrail") or []
            
            # RE-SCAN after successful remediation to verify fixes
            if rem_res.get("remediationStatus") != "failed" and action == "fix-all":
                task["currentStep"] = "re_scan"
                task["progress"] = 95
                # Persist remediation state
                self._persistence.save_task(task_id, task)
                
                # Execute re-scan
                scanner_service = ScannerService()
                recon_data = task.get("reconData", {})
                try:
                    rescan_res = scanner_service.execute_scan(task["domain"], task["scanProfile"], recon_data)
                    task["rescanFindings"] = rescan_res.get("normalizedFindings", [])
                    task["rescanStatus"] = "completed"
                except Exception as rescan_exc:
                    task["rescanStatus"] = "failed"
                    task["rescanError"] = str(rescan_exc)
            
            # Set task status back to completed (or failed if remediation failed)
            if rem_res.get("remediationStatus") == "failed":
                task["status"] = "failed"
            else:
                task["status"] = "completed"
                
            task["currentStep"] = None
            task["progress"] = 100
            # Persist final state
            self._persistence.save_task(task_id, task)

        except Exception as exc:
            if task_id in self._tasks:
                self._tasks[task_id]["remediationStatus"] = "failed"
                self._tasks[task_id]["status"] = "failed"
                self._tasks[task_id]["currentStep"] = None
                self._tasks[task_id]["progress"] = 100
                self._tasks[task_id]["error"] = str(exc)
                # Persist failed state
                self._persistence.save_task(task_id, self._tasks[task_id])
