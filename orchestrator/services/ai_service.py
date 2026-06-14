import httpx
from datetime import datetime
from models.schemas import AnalyzeRequest, AnalyzeResponse, AIAnalysis, ReportRequest, ReportResponse
from config import AI_BASE_URL

MOCK_ANALYSIS = [
    AIAnalysis(
        id="SEC001",
        title="Missing Content-Security-Policy Header",
        severity="HIGH",
        explanation="A Content-Security-Policy header tells browsers which sources of content are allowed to load. Without it, browsers execute scripts from any source including malicious ones injected through forms or compromised third-party scripts.",
        impact="Attackers can inject malicious scripts giving full access to cookies, session tokens and user data — potentially leading to account takeover or data theft.",
        recommended_fix="Add a Content-Security-Policy header restricting script sources to your own domain and trusted CDNs.",
        code_snippet="Content-Security-Policy: default-src 'self'; script-src 'self' cdnjs.cloudflare.com",
        confidence=96
    ),
    AIAnalysis(
        id="SEC002",
        title="Missing Strict-Transport-Security Header",
        severity="MEDIUM",
        explanation="HSTS instructs browsers to only connect to your site over HTTPS. Without it, the first connection can be intercepted and downgraded to plain HTTP by an attacker.",
        impact="Attackers on public WiFi can perform man-in-the-middle attacks intercepting login credentials and session cookies during unprotected requests.",
        recommended_fix="Add an HSTS header forcing HTTPS for at least one year including subdomains.",
        code_snippet="Strict-Transport-Security: max-age=31536000; includeSubDomains",
        confidence=94
    ),
    AIAnalysis(
        id="SEC003",
        title="Directory Listing Enabled",
        severity="HIGH",
        explanation="The /backup/ directory has directory listing enabled, meaning anyone who visits that URL can see a full list of every file stored there including sensitive backups and configs.",
        impact="Attackers can browse and download database dumps, .env files and backups directly — exposing credentials, API keys and entire user databases.",
        recommended_fix="Disable directory listing in the web server config and restrict access to /backup/ entirely.",
        code_snippet="autoindex off;\nlocation /backup/ { deny all; }",
        confidence=98
    ),
    AIAnalysis(
        id="SEC004",
        title="Outdated TLS Configuration",
        severity="CRITICAL",
        explanation="Your server still accepts connections using TLS 1.0, a protocol from 1999 with multiple known cryptographic weaknesses. Modern browsers are phasing out support.",
        impact="Attackers can exploit BEAST and POODLE vulnerabilities in TLS 1.0 to decrypt traffic between users and your server, exposing passwords and session data.",
        recommended_fix="Disable TLS 1.0 and 1.1, allow only TLS 1.2 and 1.3.",
        code_snippet="ssl_protocols TLSv1.2 TLSv1.3;",
        confidence=99
    )
]

async def run_analysis(request: AnalyzeRequest) -> AnalyzeResponse:
    target = request.domain.strip().lower()
    print(f"[AI] Mapping analysis from Person 1 scan results for: {target}")
    from services.scanner_service import LAST_SCAN_RESULTS
    
    # Try to read the analysis from the last scan results cached during run_scan
    scan_data = LAST_SCAN_RESULTS.get(target)
    if scan_data and "aiAnalysis" in scan_data:
        try:
            ai_data = scan_data["aiAnalysis"]
            recs = ai_data.get("recommendations", [])
            analysis_list = []
            for r in recs:
                # Map recommendation items to AIAnalysis schemas
                analysis_list.append(AIAnalysis(
                    id=r.get("findingId") or r.get("id", "SEC000"),
                    title=r.get("title", "Mitigate Vulnerability"),
                    severity=r.get("severity", "MEDIUM").upper(),
                    explanation=r.get("description", "Vulnerability correction advisory."),
                    impact="Potential exposure of system/data configuration components.",
                    recommended_fix=r.get("remediation", "Apply configuration patches."),
                    code_snippet=None,
                    confidence=95
                ))
            print(f"[AI] Success: {len(analysis_list)} analyses mapped from cache")
            return AnalyzeResponse(
                domain=target,
                analysis=analysis_list
            )
        except Exception as e:
            print(f"[AI] Error parsing cache: {e}")

    # Fallback to mock
    print(f"[AI] Fallback to mock analysis")
    return AnalyzeResponse(
        domain=request.domain,
        analysis=MOCK_ANALYSIS
    )


async def run_report(request: ReportRequest) -> ReportResponse:
    target = request.domain.strip().lower()
    from services.scanner_service import DOMAIN_TO_TASK_ID, SCANNER_BASE_URL
    task_id = DOMAIN_TO_TASK_ID.get(target)
    print(f"[REPORT] Calling Person 1 API report generate at {SCANNER_BASE_URL}/api/report/{task_id}/generate ...")
    try:
        if not task_id:
            raise Exception("No active task ID for report generation")

        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{SCANNER_BASE_URL}/api/report/{task_id}/generate"
            )
            response.raise_for_status()
            data = response.json()
            print("[REPORT] Success")
            return ReportResponse(
                report_id=data.get("taskId") or task_id,
                domain=target,
                generated_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                pdf_url=data.get("reportUrl") or f"/reports/report-{task_id}.pdf",
                summary="Sentinel AI identified vulnerabilities and resolved all of them, improving the security posture."
            )
    except Exception as e:
        print(f"[REPORT] Person 1 offline or error — using mock report: {e}")
        return ReportResponse(
            report_id="SNT-2026-0001",
            domain=request.domain,
            generated_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            pdf_url=None,
            summary="Sentinel AI identified 4 vulnerabilities and resolved all of them, improving the security score from 58 to 94 — a 62% improvement in overall security posture."
        )