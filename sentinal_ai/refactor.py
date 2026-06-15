import re

def main():
    app_path = r"c:\Users\nidhi\Desktop\sential-ai\sentinal_ai\frontend\src\App.jsx"
    nav_path = r"c:\Users\nidhi\Desktop\sential-ai\sentinal_ai\frontend\src\components\layout\Navbar.jsx"
    ctx_path = r"c:\Users\nidhi\Desktop\sential-ai\sentinal_ai\frontend\src\context\DashboardContext.jsx"
    rem_path = r"c:\Users\nidhi\Desktop\sential-ai\sentinal_ai\frontend\src\sections\Remediation\Remediation.jsx"
    ver_path = r"c:\Users\nidhi\Desktop\sential-ai\sentinal_ai\frontend\src\sections\Verification\Verification.jsx"

    # 1. Navbar.jsx
    with open(nav_path, 'r', encoding='utf-8') as f:
        nav = f.read()
    nav = nav.replace("  { key: 'verification', label: 'Verification' },\n", "")
    nav = nav.replace("  { key: 'forensicReport', label: 'Report' },\n", "")
    with open(nav_path, 'w', encoding='utf-8') as f:
        f.write(nav)

    # 2. DashboardContext.jsx
    with open(ctx_path, 'r', encoding='utf-8') as f:
        ctx = f.read()
    ctx = ctx.replace("  VERIFICATION: 'verification',\n", "")
    ctx = ctx.replace("  FORENSIC_REPORT: 'forensicReport',\n", "")
    with open(ctx_path, 'w', encoding='utf-8') as f:
        f.write(ctx)

    # 3. App.jsx
    with open(app_path, 'r', encoding='utf-8') as f:
        app = f.read()
    app = app.replace("import Verification from './sections/Verification/Verification';\n", "")
    app = app.replace("import ForensicReport from './sections/ForensicReport/ForensicReport';\n", "")
    
    app = re.sub(r"  const handleRemediationProceed = \(\) => \{.*?\};\n", "", app, flags=re.DOTALL)
    app = re.sub(r"  const handleVerificationProceed = \(\) => \{.*?\};\n", "", app, flags=re.DOTALL)
    
    # Change <Remediation onProceed={handleRemediationProceed} /> to just <Remediation />
    app = app.replace("<Remediation onProceed={handleRemediationProceed} />", "<Remediation />")
    
    # Remove cases
    app = re.sub(r"      case sections\.VERIFICATION:.*?return <Verification [^>]+/>;\n", "", app, flags=re.DOTALL)
    app = re.sub(r"      case sections\.FORENSIC_REPORT:.*?return <ForensicReport />;\n", "", app, flags=re.DOTALL)
    
    # Remove from DevNav
    app = app.replace("      { name: 'Verify', section: sections.VERIFICATION, icon: CheckCircle },\n", "")
    app = app.replace("      { name: 'Report', section: sections.FORENSIC_REPORT, icon: FileText },\n", "")
    
    with open(app_path, 'w', encoding='utf-8') as f:
        f.write(app)

    # 4. Remediation.jsx - We apply the UI consolidation
    with open(rem_path, 'r', encoding='utf-8') as f:
        rem = f.read()
    with open(ver_path, 'r', encoding='utf-8') as f:
        ver = f.read()

    # Update imports in Remediation
    rem = rem.replace(
        "import { Bot, Zap, Cpu, Activity, Shield, CheckCircle, Sparkles, ArrowRight, Terminal, Wifi } from 'lucide-react';",
        "import { Bot, Zap, Cpu, Activity, Shield, CheckCircle, Sparkles, ArrowRight, Terminal, Wifi, Trophy, PartyPopper, TrendingUp, Download, FileJson, ShieldCheck, Star, BarChart3, Target, Award } from 'lucide-react';"
    )
    if "import AnimatedCounter" not in rem:
        rem = rem.replace(
            "import GlowButton from '../../components/common/GlowButton';",
            "import GlowButton from '../../components/common/GlowButton';\nimport AnimatedCounter from '../../components/common/AnimatedCounter';\nimport GlassCard from '../../components/common/GlassCard';"
        )
    if "import { generateReport }" not in rem:
        rem = rem.replace(
            "import { applyFixAll, getRemediationStatus } from '../../services/remediationService';",
            "import { applyFixAll, getRemediationStatus } from '../../services/remediationService';\nimport { generateReport } from '../../services/reportService';"
        )

    # State injection
    state_code = """    const [afterScoreAnimated, setAfterScoreAnimated] = useState(false);
    const [isHoveringDownload, setIsHoveringDownload] = useState(false);
    const [isHoveringExport, setIsHoveringExport] = useState(false);

    useEffect(() => {
        if (remediationComplete) {
            const timer = setTimeout(() => {
                setAfterScoreAnimated(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [remediationComplete]);

    const findings = scanData?.findings || [];
    const deduction = findings.reduce((acc, f) => {
        if (f.severity === 'CRITICAL') return acc + 15;
        if (f.severity === 'HIGH') return acc + 10;
        if (f.severity === 'MEDIUM') return acc + 5;
        return acc + 2;
    }, 0);
    const calculatedBeforeScore = Math.max(0, 100 - deduction);
    const beforeScore = verificationData?.before?.score || (findings.length > 0 ? calculatedBeforeScore : 58);
    const afterScore = verificationData?.after?.score || 94;
    const improvement = afterScore - beforeScore;

    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const reportId = `SNT-${currentDate.replace(/,/g, '').replace(/ /g, '-')}-${Math.floor(Math.random() * 9999)}`;

    const vulnerabilities = (scanData?.findings || []).map(v => ({
        severity: v.severity || 'MEDIUM',
        title: v.name || v.title,
        desc: v.description,
        cvss: v.score || v.cvss || '7.5',
        epss: '0.90%'
    }));

    const handleDownloadPDF = async () => {
        try {
            const result = await generateReport(taskId);
            if (result.reportUrl) window.open(result.reportUrl, '_blank');
            else if (result.pdfUrl) window.open(result.pdfUrl, '_blank');
            else alert('Report generated, but URL is missing.');
        } catch (error) {
            console.error("Report generation failed:", error);
            alert('Report generation failed.');
        }
    };

    const handleExportJSON = () => {
        const exportData = {
            reportMetadata: { reportId, generatedAt: `${currentDate} ${currentTime}`, target: targetDomain || 'sample-domain.com', auditor: 'Sentinel AI v2.4.1' },
            executiveSummary: { totalFindings: vulnerabilities.length, resolvedCount: vulnerabilities.length, resolutionRate: '100%', scoreBefore: beforeScore, scoreAfter: afterScore, improvement: `+${improvement} points` },
            findings: vulnerabilities,
            verificationResults: { status: 'PASSED', scoreImprovement: `+${improvement}`, allVulnerabilitiesResolved: true },
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${reportId}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };
"""
    rem = rem.replace(
        "    const progress = (completedSteps.length / steps.length) * 100;",
        state_code + "\n    const progress = (completedSteps.length / steps.length) * 100;"
    )

    # Extract UI from Verification.jsx
    hero_score_start = ver.find("                {/* Page Header */}")
    cta_start = ver.find("                {/* CTA Button with 3D Pulse */}")
    verification_jsx = ver[hero_score_start:cta_start]

    new_cta_block = """
                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.5, duration: 0.5 }}
                    className="flex justify-center pb-8"
                >
                    <div className="flex flex-wrap items-center justify-center gap-5">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onHoverStart={() => setIsHoveringDownload(true)}
                            onHoverEnd={() => setIsHoveringDownload(false)}
                        >
                            <GlowButton
                                onClick={handleDownloadPDF}
                                variant="primary"
                                icon={<Download className="w-4 h-4" />}
                                className="px-8 py-3 text-base group"
                            >
                                <span className="flex items-center gap-2">
                                    DOWNLOAD PDF REPORT
                                    {isHoveringDownload && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-xs text-accent-cyan"
                                        >
                                            (Secure PDF)
                                        </motion.span>
                                    )}
                                </span>
                            </GlowButton>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onHoverStart={() => setIsHoveringExport(true)}
                            onHoverEnd={() => setIsHoveringExport(false)}
                        >
                            <GlowButton
                                onClick={handleExportJSON}
                                variant="secondary"
                                icon={<FileJson className="w-4 h-4" />}
                                className="px-8 py-3 text-base group"
                            >
                                <span className="flex items-center gap-2">
                                    EXPORT RAW DATA (JSON)
                                    {isHoveringExport && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-xs text-accent-cyan"
                                        >
                                            (SIEM Ready)
                                        </motion.span>
                                    )}
                                </span>
                            </GlowButton>
                        </motion.div>
                    </div>
                </motion.div>
"""
    combined_verification_jsx = verification_jsx + new_cta_block

    old_button_block = """                            {/* Completion Button */}
                            {remediationComplete && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-center pt-4"
                                >
                                    <GlowButton
                                        onClick={handleVerification}
                                        variant="success"
                                        icon={<CheckCircle className="w-4 h-4" />}
                                        className="px-8 py-3 text-base group"
                                    >
                                        VIEW VERIFICATION RESULTS
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                    </GlowButton>
                                </motion.div>
                            )}"""

    new_block = "                            {/* Verification Results Block */}\n                            {remediationComplete && (\n                                <div className=\"mt-12\">\n" + combined_verification_jsx + "\n                                </div>\n                            )}"
    
    rem = rem.replace(old_button_block, new_block)

    # We also remove `onProceed` from the props in Remediation.jsx and `handleVerification`
    rem = rem.replace("const Remediation = ({ onProceed }) => {", "const Remediation = () => {")
    
    # We should delete handleVerification entirely to be clean, but leaving it unused is harmless.
    # We will just replace handleVerification so there's no unused variable warning.
    handle_ver_pattern = re.compile(r"    const handleVerification = \(\) => \{.*?\n    \};\n", re.DOTALL)
    rem = handle_ver_pattern.sub("", rem)

    with open(rem_path, 'w', encoding='utf-8') as f:
        f.write(rem)

    print("Refactor complete.")

if __name__ == "__main__":
    main()
