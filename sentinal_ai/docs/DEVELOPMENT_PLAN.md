# Sentinel AI Development Plan

## Overview
This development plan is a dependency-driven roadmap for the Sentinel AI hackathon project. It is organized by role and phase to enable independent work, clear handoffs, and integrated delivery.

## Note: Orchestration Consolidation (v1.1)

**Update:** The standalone `backend/orchestration/` component has been consolidated into the backend API layer for architectural simplicity. 

- **Old Model:** `orchestrator/` was a separate FastAPI service (port 8002) that proxied requests to other backend services.
- **New Model:** `backend/api/services/scan_service.py` now contains all orchestration logic, coordinating task lifecycle across recon, scanner, AI analysis, and remediation modules.
- **Impact on Plan:** Person C's Phase 2 task "Implement FastAPI orchestration skeleton" is now focused on `backend/api/` routes and `scan_service.py` instead of a separate `backend/orchestration/` folder.
- **Result:** Simpler architecture with fewer moving parts, single API entry point, and easier frontend-backend integration.

## Person A (Security Engineer)

### Phase 1: Independent Work
| Task | Spec | File | Dependency | Deliverable |
| --- | --- | --- | --- | --- |
| Define domain reconnaissance validation and allowlist enforcement | `SPEC_DOMAIN_RECON.md` | `specs/security/scanning_scope.md` | Team target policy | Domain recon validation spec and controlled-target prove-out |
| Define scanner adapter contracts for ZAP, Nikto, and sslyze | `SPEC_VULNERABILITY_SCANNER.md` | `specs/security/scanning_scope.md` | `API_CONTRACTS.md` | Scanner integration contract and adapter stubs |
| Define remediation action framework and audit trail format | `SPEC_REMEDIATION_AGENT.md` | `specs/security/remediation_workflow.md` | `SPEC_AI_ANALYSIS.md` | Remediation workflow definition and safe execution spec |

### Phase 2: Core Features
| Task | Spec | File | Dependency | Deliverable |
| --- | --- | --- | --- | --- |
| Implement domain reconnaissance service | `SPEC_DOMAIN_RECON.md` | `backend/reconnaissance/` | `specs/security/scanning_scope.md` | Working recon module for allowlisted targets |
| Build OWASP ZAP adapter and initial scan runner | `SPEC_VULNERABILITY_SCANNER.md` | `backend/scanner/zap_adapter.py` | `SPEC_FASTAPI_ORCHESTRATION.md` | ZAP integration with raw findings collection |
| Build Nikto adapter and SSL analysis pipeline | `SPEC_VULNERABILITY_SCANNER.md` | `backend/scanner/nikto_adapter.py` | `SPEC_FASTAPI_ORCHESTRATION.md` | Additional scanner coverage and normalized output |
| Implement remediation executor and audit logging | `SPEC_REMEDIATION_AGENT.md` | `backend/remediation/` | `SPEC_AI_ANALYSIS.md` | Fix action engine with audit entries |

### Phase 3: Integration
| Task | Spec | File | Dependency | Deliverable |
| --- | --- | --- | --- | --- |
| Wire recon and scanner into orchestration task lifecycle | `SPEC_FASTAPI_ORCHESTRATION.md` | `backend/orchestration/` | Person C orchestration implementation | Integrated scan execution path |
| Validate scan output compatibility with AI analysis payload | `SPEC_AI_ANALYSIS.md` | `backend/scanner/` | Person B AI contract | Confirmed normalized findings payload |
| Provide remediation readiness metadata to frontend | `SPEC_FRONTEND_DASHBOARD.md` | `backend/remediation/` | Person C API contracts | Remediation action payloads for UI |

### Phase 4: Verification
| Task | Spec | File | Dependency | Deliverable |
| --- | --- | --- | --- | --- |
| Execute controlled target scan and compliance review | `specs/security/scanning_scope.md` | `docs/process/hackathon_criteria.md` | Phase 3 integrated system | Verified scanning audit report |
| Validate remediation action audit trail and status | `SPEC_REMEDIATION_AGENT.md` | `DEPENDENCY_MAP.md` | Phase 3 remediation integration | Confirmed fix execution and rollback readiness |
| Confirm final report receives scanner and remediation artifacts | `SPEC_FORENSIC_REPORT.md` | `specs/reporting/forensic_report_spec.md` | Person B report design | Validated report payload and content || Deploy integrated Sentinel AI stack to AWS EC2 | ARCHITECTURE.md | deployment/ | Phase 3 integration complete | Cloud-hosted verification environment |

### Phase 5: Demo Readiness
| Task | Spec | File | Dependency | Deliverable |
| --- | --- | --- | --- | --- |
| Harden controlled-target validation and fail-safe checks | `SPEC_DOMAIN_RECON.md` | `ARCHITECTURE.md` | Phase 4 verification | Safe demo launch configuration |
| Document remediation action flow for demo narrative | `SPEC_REMEDIATION_AGENT.md` | `docs/design/deployment_architecture.md` | Phase 4 acceptance | Live remediation story and fallback plan |
| Support final demo readiness and support handoff | `TEAM_RESPONSIBILITIES.md` | `docs/process/hackathon_criteria.md` | Team readiness checks | Demo execution checklist || Verify AWS EC2 deployment and demo environment | ARCHITECTURE.md | deployment/ | Phase 4 complete | Demo-ready cloud environment |

## Person B (AI Engineer)

### Phase 1: Independent Work
| Task | Spec | File | Dependency | Deliverable |
| --- | --- | --- | --- | --- |
| Define Claude prompt structure and response schema | `SPEC_AI_ANALYSIS.md` | `specs/api/ai_integration.md` | Claude API docs | AI analysis contract and response parser spec |
| Define report content model and output sections | `SPEC_FORENSIC_REPORT.md` | `specs/reporting/report_format.md` | `SPEC_AI_ANALYSIS.md` | Forensic report schema and section mapping |
| Define AI advisory and remediation metadata fields | `SPEC_AI_ANALYSIS.md` | `SPEC_FRONTEND_DASHBOARD.md` | Team remediation contract | Recommendation model for UI and backend |

### Phase 2: Core Features
| Task | Spec | File | Dependency | Deliverable |
| --- | --- | --- | --- | --- |
| Implement Claude integration and prompt engine | `SPEC_AI_ANALYSIS.md` | `backend/ai/claude_client.py` | `SPEC_API_CONTRACTS.md` | Working AI request/response module |
| Implement analysis response parser and normalization | `SPEC_AI_ANALYSIS.md` | `backend/ai/analysis_parser.py` | Scanner output definitions | Structured recommendations and confidence notes |
| Implement report generation pipeline | `SPEC_FORENSIC_REPORT.md` | `backend/reporting/` | AI output contract | PDF/HTML rendering engine and artifact metadata |

### Phase 3: Integration
| Task | Spec | File | Dependency | Deliverable |
| --- | --- | --- | --- | --- |
| Accept scanner findings from orchestration and produce AI output | `SPEC_FASTAPI_ORCHESTRATION.md` | `backend/ai/` | Person A scanner module | Integrated AI analysis path |
| Supply remediation recommendations to remediation agent | `SPEC_REMEDIATION_AGENT.md` | `backend/ai/` | Person A remediation contract | Closed loop from AI to fix engine |
| Provide report payload to frontend and storage | `SPEC_FRONTEND_DASHBOARD.md` | `backend/reporting/` | Phase 3 orchestration | Final report artifact endpoint |

### Phase 4: Verification
| Task | Spec | File | Dependency | Deliverable |
| --- | --- | --- | --- | --- |
| Validate AI output against contract and edge cases | `SPEC_AI_ANALYSIS.md` | `specs/api/ai_integration.md` | Phase 3 integrated system | AI output acceptance tests |
| Validate report rendering across PDF and HTML | `SPEC_FORENSIC_REPORT.md` | `specs/reporting/forensic_report_spec.md` | Report generation pipeline | Rendered report artifacts and verification |
| Confirm AI analysis is surfaced in dashboard correctly | `SPEC_FRONTEND_DASHBOARD.md` | `docs/design/systems_overview.md` | Phase 3 frontend integration | UI-ready AI analysis payloads |

### Phase 5: Demo Readiness
| Task | Spec | File | Dependency | Deliverable |
| --- | --- | --- | --- | --- |
| Stabilize Claude request behavior for demo | `SPEC_AI_ANALYSIS.md` | `docs/process/hackathon_criteria.md` | Phase 4 validation | Reliable AI response flow |
| Finalize report output visuals and content | `SPEC_FORENSIC_REPORT.md` | `docs/design/deployment_architecture.md` | Report rendering tests | Demo-quality report artifact |
| Support demo talking points for AI insights | `docs/process/hackathon_criteria.md` | `TEAM_RESPONSIBILITIES.md` | Final system integration | Demo narrative for analysis and remediation |

## Person C (Frontend + Integration Engineer)

### Phase 1: Independent Work
| Task | Spec | File | Dependency | Deliverable |
| --- | --- | --- | --- | --- |
| Define REST API endpoints and task lifecycle | `SPEC_FASTAPI_ORCHESTRATION.md` | `API_CONTRACTS.md` | Team architecture | Backend API contract and task model |
| Define frontend workflow and UI contract | `SPEC_FRONTEND_DASHBOARD.md` | `specs/api/frontend_integration.md` | Team UX requirements | Dashboard workflow and component contract |
| Define integration boundaries among subsystems | `ARCHITECTURE.md` | `docs/design/systems_overview.md` | Person A and B specs | System architecture document |

### Phase 2: Core Features
| Task | Spec | File | Dependency | Deliverable |
| --- | --- | --- | --- | --- |
| Implement FastAPI orchestration skeleton | `SPEC_FASTAPI_ORCHESTRATION.md` | `backend/api/` | `API_CONTRACTS.md` | Orchestration service skeleton |
| Implement React dashboard shell and routes | `SPEC_FRONTEND_DASHBOARD.md` | `frontend/` | `API_CONTRACTS.md` | Dashboard UI scaffold |
| Create backend task state and status polling | `SPEC_FASTAPI_ORCHESTRATION.md` | `backend/orchestration/` | `SPEC_DOMAIN_RECON.md` | Task lifecycle framework |

### Phase 3: Integration
| Task | Spec | File | Dependency | Deliverable |
| --- | --- | --- | --- | --- |
| Integrate recon/scanner/AI/remediation into workflow | `SPEC_FASTAPI_ORCHESTRATION.md` | `backend/orchestration/` | Phase 2 components | End-to-end backend workflow |
| Connect frontend to backend endpoints | `SPEC_FRONTEND_DASHBOARD.md` | `frontend/` | Phase 2 and Person A/B modules | Working dashboard interactions |
| Implement report retrieval and artifact display | `SPEC_FORENSIC_REPORT.md` | `frontend/` | Person B reporting module | Final report access in UI |

### Phase 4: Verification
| Task | Spec | File | Dependency | Deliverable |
| --- | --- | --- | --- | --- |
| Run API contract and integration tests | `SPEC_FASTAPI_ORCHESTRATION.md` | `specs/api/backend_api.md` | Phase 3 integration | Contract compliance report |
| Validate frontend workflows and error states | `SPEC_FRONTEND_DASHBOARD.md` | `frontend/` | Integrated backend | UI acceptance tests |
| Confirm orchestration handles scan, fix, and report states | `DEPENDENCY_MAP.md` | `docs/process/hackathon_criteria.md` | Phase 3 system | Verified end-to-end state transitions |

### Phase 5: Demo Readiness
| Task | Spec | File | Dependency | Deliverable |
| --- | --- | --- | --- | --- |
| Harden backend and frontend for demo reliability | `docs/design/deployment_architecture.md` | `docs/process/hackathon_criteria.md` | Phase 4 verification | Demo-stable deployment config |
| Finalize dashboards and live action flow | `SPEC_FRONTEND_DASHBOARD.md` | `frontend/` | Completed integration | Demo-ready UI sequence |
| Prepare integration checkpoints and rollback plan | `TEAM_RESPONSIBILITIES.md` | `docs/process/hackathon_criteria.md` | Full system | Demo execution and fallback plan |

## Blocked By / Unblocked By
- Person A Phase 2 scanner implementation is blocked by Person C Phase 1 API contract definitions and Person B AI payload schema.
- Person B Phase 2 Claude integration is blocked by Person A normalized finding format and Person C backend task lifecycle contract.
- Person C Phase 3 integration is blocked by Person A and Person B Phase 2 core module delivery.
- Person A and B Phase 4 verification are blocked by Person C integrated orchestration and frontend connectivity.
- Person C Phase 5 demo readiness is blocked by completed verification from all roles.

## Parallel Tasks
- Person A recon and scanner adapters can be built in parallel with Person B AI prompt design.
- Person C API contract definition and frontend workflow design can proceed in parallel with Person A/B Phase 1 work.
- Person B report formatting can be developed while Person A builds remediation action audit logs.
- Person A vulnerability scanning and Person B AI analysis should be implemented in parallel once input/output contracts are stable.

## Dependency Chains
1. Phase 1 contracts → Phase 2 core modules → Phase 3 integration → Phase 4 verification → Phase 5 demo.
2. `SPEC_DOMAIN_RECON.md` → `SPEC_VULNERABILITY_SCANNER.md` → `SPEC_AI_ANALYSIS.md` → `SPEC_REMEDIATION_AGENT.md` → `SPEC_FORENSIC_REPORT.md`.
3. `SPEC_FASTAPI_ORCHESTRATION.md` and `SPEC_FRONTEND_DASHBOARD.md` provide the integration glue across roles.

## Integration Checkpoints
- Checkpoint 1: Phase 1 review of architecture, API contracts, and template specs.
- Checkpoint 2: Phase 2 demo of independent modules with mocked upstream/downstream behavior.
- Checkpoint 3: Phase 3 end-to-end integration test for a controlled target scan.
- Checkpoint 4: Phase 4 verification of security scope, remediation audit, and report generation.
- Checkpoint 5: Phase 5 demo rehearsal and fallback readiness.

## Final Dependency Map
- Person A delivers recon, scanner, and remediation artifacts that feed Person B and C.
- Person B delivers AI analysis and report generation artifacts that feed Person C and the frontend.
- Person C delivers orchestration, backend APIs, and dashboard integration that binds Persons A and B.
- Shared documentation and specs ensure independent work: `SPEC_*` docs, `API_CONTRACTS.md`, `ARCHITECTURE.md`, `DEPENDENCY_MAP.md`, and `TEAM_RESPONSIBILITIES.md`.
- The project plan is designed so each role can begin Phase 1 work immediately with no additional clarification required.
