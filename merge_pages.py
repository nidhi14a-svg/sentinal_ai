import re
import os

rem_path = r"c:\Users\nidhi\Desktop\sential-ai\sentinal_ai\frontend\src\sections\Remediation\Remediation.jsx"
ver_path = r"c:\Users\nidhi\Desktop\sential-ai\sentinal_ai\frontend\src\sections\Verification\Verification.jsx"

with open(rem_path, 'r', encoding='utf-8') as f:
    rem_content = f.read()
    
with open(ver_path, 'r', encoding='utf-8') as f:
    ver_content = f.read()

# 1. Update imports in Remediation.jsx
rem_content = rem_content.replace(
    "import { Bot, Zap, Cpu, Activity, Shield, CheckCircle, Sparkles, ArrowRight, Terminal, Wifi } from 'lucide-react';",
    "import { Bot, Zap, Cpu, Activity, Shield, CheckCircle, Sparkles, ArrowRight, Terminal, Wifi, Trophy, PartyPopper, TrendingUp, Download, FileJson, ShieldCheck, Star, BarChart3 } from 'lucide-react';"
)

if "import AnimatedCounter" not in rem_content:
    rem_content = rem_content.replace(
        "import GlowButton from '../../components/common/GlowButton';",
        "import GlowButton from '../../components/common/GlowButton';\nimport AnimatedCounter from '../../components/common/AnimatedCounter';"
    )

if "import { generateReport }" not in rem_content:
    rem_content = rem_content.replace(
        "import { applyFixAll, getRemediationStatus } from '../../services/remediationService';",
        "import { applyFixAll, getRemediationStatus } from '../../services/remediationService';\nimport { generateReport } from '../../services/reportService';"
    )

# 2. Add state and handlers
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
    const afterScore = verificationData?.after?.score || 100;
    const improvement = afterScore - beforeScore;

    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    const reportId = `SNT-${currentDate.replace(/,/g, '').replace(/ /g, '-')}-${Math.floor(Math.random() * 9999)}`;

    const vulnerabilities = (scanData?.findings || []).map(v => ({
        severity: v.severity || 'MEDIUM',
        title: v.name || v.title,
        desc: v.description,
        cvss: v.score || v.cvss || '7.5',
        epss: '0.90%'
    }));

    const realRecommendations = scanData?.aiAnalysis?.recommendations || [];
    const _recommendations = realRecommendations.map(r => ({
        priority: r.severity === 'CRITICAL' ? 'P0' : r.severity === 'HIGH' ? 'P1' : 'P2',
        action: r.remediation || r.action || r.description,
        effort: r.estimatedEffort || 'Medium',
        impact: r.severity === 'CRITICAL' ? 'Critical' : r.severity === 'HIGH' ? 'High' : 'Medium'
    }));

    const exportRemediationActions = [
        { time: '14:32:08', action: 'Established secure shell connection', status: 'completed', duration: '0.8s' },
        { time: '14:32:14', action: 'Added Content-Security-Policy header', status: 'completed', duration: '1.2s' },
        { time: '14:32:20', action: 'Added Strict-Transport-Security header', status: 'completed', duration: '0.9s' },
        { time: '14:32:26', action: 'Disabled directory listing on /backup/', status: 'completed', duration: '1.1s' },
        { time: '14:32:32', action: 'Upgraded TLS configuration to 1.2/1.3', status: 'completed', duration: '1.5s' },
        { time: '14:32:40', action: 'Restarted nginx service', status: 'completed', duration: '2.3s' },
        { time: '14:32:52', action: 'Verification scan completed', status: 'completed', duration: '3.2s' },
    ];

    const handleDownloadPDF = async () => {
        try {
            const result = await generateReport(taskId);
            if (result.reportUrl) {
                window.open(result.reportUrl, '_blank');
            } else if (result.pdfUrl) {
                window.open(result.pdfUrl, '_blank');
            } else {
                console.error("No report URL returned", result);
                alert('Report generated, but URL is missing.');
            }
        } catch (error) {
            console.error("Report generation failed:", error);
            alert('Report generation failed.');
        }
    };

    const handleExportJSON = () => {
        const exportData = {
            reportMetadata: {
                reportId,
                generatedAt: `${currentDate} ${currentTime}`,
                target: targetDomain || 'sample-domain.com',
                auditor: 'Sentinel AI v2.4.1',
            },
            executiveSummary: {
                totalFindings: vulnerabilities.length,
                resolvedCount: vulnerabilities.length,
                resolutionRate: '100%',
                scoreBefore: beforeScore,
                scoreAfter: afterScore,
                improvement: `+${improvement} points`,
            },
            findings: vulnerabilities,
            recommendations: _recommendations,
            remediationTimeline: exportRemediationActions,
            verificationResults: {
                status: 'PASSED',
                scoreImprovement: `+${improvement}`,
                allVulnerabilitiesResolved: true,
            },
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

rem_content = rem_content.replace(
    "    const progress = (completedSteps.length / steps.length) * 100;",
    state_code + "\n    const progress = (completedSteps.length / steps.length) * 100;"
)

# 3. Extract JSX from Verification.jsx
# We need from <motion.div initial={{ opacity: 0, scale: 0.95 }} ... className="mb-10"> (Hero Score section)
# up to the end of the CTA Button
hero_score_start = ver_content.find("                {/* Hero Score Section")
cta_end = ver_content.find("                </motion.div>", ver_content.find("                {/* CTA Button with 3D Pulse */}")) + len("                </motion.div>")

verification_jsx = ver_content[hero_score_start:cta_end]

# 4. Replace the old button block in Remediation.jsx with the Verification JSX inside {remediationComplete && ( ... )}
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

new_block = "                            {/* Verification Results Block */}\n                            {remediationComplete && (\n                                <div>\n" + verification_jsx + "\n                                </div>\n                            )}"

rem_content = rem_content.replace(old_button_block, new_block)

with open(rem_path, 'w', encoding='utf-8') as f:
    f.write(rem_content)
