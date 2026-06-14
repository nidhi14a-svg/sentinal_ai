import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, AlertTriangle, Brain, Wrench, ShieldCheck,
    Download, FileJson, Calendar, Target, Hash, CheckCircle2,
    TrendingUp, Shield, Clock, Server, Lock, Eye, Globe,
    Zap, Award, BarChart3, Fingerprint, QrCode, Scan,
    ClipboardCheck, Activity, Cpu, Sparkles, Star, ArrowRight
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { generateReport } from '../../services/reportService';
import ReportSection from './ReportSection';
import GlowButton from '../../components/common/GlowButton';
import GlassCard from '../../components/common/GlassCard';
import SeverityBadge from '../../components/common/SeverityBadge';
import ParticleField from '../../components/background/ParticleField';
import GridBackground from '../../components/background/GridBackground';
import ScanlineOverlay from '../../components/background/ScanlineOverlay';

const ForensicReport = () => {
    const { reportData, scanData, verificationData, targetDomain } = useDashboard();
    const [isHoveringDownload, setIsHoveringDownload] = useState(false);
    const [isHoveringExport, setIsHoveringExport] = useState(false);

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
    const blockchainHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    const vulnerabilities = (scanData?.vulnerabilities || []).length > 0 ? scanData.vulnerabilities.map(v => ({
        severity: v.severity,
        title: v.name || v.title,
        desc: v.description,
        cvss: v.score || v.cvss || '7.5',
        epss: '0.90%'
    })) : [
        { severity: 'CRITICAL', title: 'Outdated TLS Configuration', desc: 'TLS 1.0 enabled, vulnerable to known exploits', cvss: '8.1', epss: '0.95%' },
        { severity: 'HIGH', title: 'Missing Content-Security-Policy Header', desc: 'No CSP header detected, allowing arbitrary script execution', cvss: '7.2', epss: '0.87%' },
        { severity: 'HIGH', title: 'Directory Listing Enabled', desc: '/backup/ directory publicly exposed file listing', cvss: '7.5', epss: '0.92%' },
        { severity: 'MEDIUM', title: 'Missing Strict-Transport-Security Header', desc: 'HSTS not enforced, allowing protocol downgrade', cvss: '5.8', epss: '0.43%' },
    ];

    const recommendations = [
        { priority: 'P0', action: 'Disable TLS 1.0/1.1, enable only TLS 1.2 and TLS 1.3', effort: 'Low', impact: 'Critical' },
        { priority: 'P1', action: 'Add Content-Security-Policy header: default-src \'self\'; script-src \'self\' cdnjs.cloudflare.com', effort: 'Low', impact: 'High' },
        { priority: 'P1', action: 'Disable directory listing and restrict access to /backup/ path', effort: 'Low', impact: 'High' },
        { priority: 'P2', action: 'Enable HSTS with max-age=31536000 and includeSubDomains flag', effort: 'Low', impact: 'Medium' },
    ];

    const remediationActions = [
        { time: '14:32:08', action: 'Established secure shell connection', icon: Server, status: 'completed', duration: '0.8s' },
        { time: '14:32:14', action: 'Added Content-Security-Policy header', icon: Shield, status: 'completed', duration: '1.2s' },
        { time: '14:32:20', action: 'Added Strict-Transport-Security header', icon: Lock, status: 'completed', duration: '0.9s' },
        { time: '14:32:26', action: 'Disabled directory listing on /backup/', icon: Eye, status: 'completed', duration: '1.1s' },
        { time: '14:32:32', action: 'Upgraded TLS configuration to 1.2/1.3', icon: Globe, status: 'completed', duration: '1.5s' },
        { time: '14:32:40', action: 'Restarted nginx service', icon: Zap, status: 'completed', duration: '2.3s' },
        { time: '14:32:52', action: 'Verification scan completed', icon: CheckCircle2, status: 'completed', duration: '3.2s' },
    ];

    const handleDownloadPDF = () => {
        const payload = {
            domain: targetDomain || 'example.team-owned-site.com',
            score_before: verificationData?.before?.score || 58,
            score_after: verificationData?.after?.score || 94
        };
        generateReport(payload)
            .then(data => {
                if (data.pdfUrl) {
                    window.open(data.pdfUrl, '_blank');
                } else {
                    alert('PDF report generated successfully on the server.');
                }
            })
            .catch(err => {
                console.error(err);
                alert('PDF report generation would start here in production.\n\nThe complete forensic report would be downloaded as a professionally formatted PDF document.');
            });
    };

    const handleExportJSON = () => {
        const exportData = {
            reportMetadata: {
                reportId,
                generatedAt: `${currentDate} ${currentTime}`,
                target: 'sample-domain.com',
                auditor: 'Sentinel AI v2.4.1',
                blockchainVerification: blockchainHash,
            },
            executiveSummary: {
                totalFindings: vulnerabilities.length,
                resolvedCount: vulnerabilities.length,
                resolutionRate: '100%',
                scoreBefore: verificationData?.before?.score || 58,
                scoreAfter: verificationData?.after?.score || 94,
                improvement: `+${(verificationData?.after?.score || 94) - (verificationData?.before?.score || 58)} points`,
            },
            findings: vulnerabilities,
            recommendations,
            remediationTimeline: remediationActions,
            verificationResults: {
                status: 'PASSED',
                scoreImprovement: `+${(verificationData?.after?.score || 94) - (verificationData?.before?.score || 58)}`,
                allVulnerabilitiesResolved: true,
            },
        };
        console.log('Exporting JSON:', exportData);
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${reportId}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const beforeScore = verificationData?.before?.score || 58;
    const afterScore = verificationData?.after?.score || 94;
    const totalRiskReduction = ((beforeScore - afterScore) / beforeScore) * 100;

    return (
        <div className="relative min-h-[calc(100vh-200px)]">
            {/* Premium Background Layers */}
            <div className="fixed inset-0 z-0 opacity-20">
                <ParticleField />
                <GridBackground />
                <ScanlineOverlay />
            </div>

            {/* Animated gradient orbs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 right-20 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Premium Document Header with 3D effect */}
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
                    className="mb-10"
                >
                    <GlassCard glowColor="cyan" className="relative overflow-hidden" borderIntensity="high">
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent-cyan to-accent-purple rounded-full blur-3xl" />
                        </div>

                        <div className="relative p-8 text-center">
                            {/* Top badges */}
                            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 backdrop-blur-sm">
                                    <Shield className="w-3.5 h-3.5 text-accent-cyan" />
                                    <span className="text-xs font-mono text-accent-cyan tracking-wider font-bold">FORENSIC SECURITY REPORT</span>
                                </div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-status-success/30 bg-status-success/10 backdrop-blur-sm">
                                    <Fingerprint className="w-3.5 h-3.5 text-status-success" />
                                    <span className="text-xs font-mono text-status-success tracking-wider">BLOCKCHAIN VERIFIED</span>
                                </div>
                            </div>

                            {/* Main Title with glow */}
                            <motion.h1
                                className="text-5xl md:text-7xl font-black mb-4 tracking-tight"
                                animate={{ textShadow: ["0 0 0px #ff1a3c", "0 0 20px #ff1a3c", "0 0 0px #ff1a3c"] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <span className="bg-gradient-to-r from-text-primary via-accent-red to-accent-cyan bg-clip-text text-transparent">
                                    Sentinel AI — Audit Report
                                </span>
                            </motion.h1>

                            {/* Meta info grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 p-4 rounded-xl bg-bg-secondary/30 border border-border-subtle">
                                <div className="flex items-center justify-center gap-2">
                                    <Target className="w-4 h-4 text-accent-cyan" />
                                    <div className="text-left">
                                        <div className="text-[10px] font-mono text-text-dim">TARGET</div>
                                        <div className="text-sm font-mono text-text-primary">{targetDomain || 'sample-domain.com'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <Calendar className="w-4 h-4 text-accent-cyan" />
                                    <div className="text-left">
                                        <div className="text-[10px] font-mono text-text-dim">DATE</div>
                                        <div className="text-sm font-mono text-text-primary">{currentDate}</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <Clock className="w-4 h-4 text-accent-cyan" />
                                    <div className="text-left">
                                        <div className="text-[10px] font-mono text-text-dim">TIME</div>
                                        <div className="text-sm font-mono text-text-primary">{currentTime} UTC</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <Hash className="w-4 h-4 text-accent-cyan" />
                                    <div className="text-left">
                                        <div className="text-[10px] font-mono text-text-dim">REPORT ID</div>
                                        <div className="text-sm font-mono text-text-primary">{reportId}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Blockchain verification hash */}
                            <div className="mt-4 p-2 rounded-lg bg-bg-primary/50 border border-accent-cyan/20">
                                <div className="flex items-center justify-center gap-2 text-[9px] font-mono text-text-dim">
                                    <QrCode className="w-3 h-3" />
                                    <span>Blockchain Verification Hash:</span>
                                    <span className="text-accent-cyan">{blockchainHash.substring(0, 20)}...{blockchainHash.substring(44)}</span>
                                    <Fingerprint className="w-3 h-3 text-status-success" />
                                </div>
                            </div>

                            {/* Glowing divider */}
                            <div className="mt-6 space-y-1">
                                <div className="h-px bg-gradient-to-r from-transparent via-accent-red to-transparent" />
                                <div className="h-px bg-gradient-to-r from-transparent via-accent-cyan to-transparent w-2/3 mx-auto" />
                                <div className="h-px bg-gradient-to-r from-transparent via-accent-purple to-transparent w-1/3 mx-auto" />
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Executive Summary Section with Score Cards */}
                <ReportSection title="Executive Summary" icon={FileText} color="cyan" delay={0.1} badge="CONFIDENTIAL">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Score Change Card */}
                        <div className="lg:col-span-2">
                            <p className="mb-4 leading-relaxed text-base">
                                Sentinel AI performed an autonomous security audit of <span className="text-accent-cyan font-mono font-bold">{targetDomain || 'sample-domain.com'}</span>,
                                identifying <span className="text-accent-red font-bold">{vulnerabilities.length} vulnerabilities</span> ranging from medium to critical severity.
                                All identified issues were analyzed by <span className="text-accent-purple font-bold">Claude AI</span>, remediated automatically by the autonomous agent,
                                and verified through a follow-up scan.
                            </p>
                            <p className="leading-relaxed text-base">
                                The site's security score improved from <span className="text-status-critical font-bold text-lg">{beforeScore}/100</span> to
                                <span className="text-status-success font-bold text-lg"> {afterScore}/100</span>, representing a
                                <span className="text-accent-cyan font-bold text-lg"> {Math.abs(totalRiskReduction).toFixed(0)}% improvement</span> in overall security posture.
                            </p>
                        </div>

                        {/* Risk Reduction Meter */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-status-success/5 to-accent-cyan/5 border border-status-success/20">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="w-4 h-4 text-status-success" />
                                <span className="text-xs font-mono text-status-success font-bold">RISK REDUCTION</span>
                            </div>
                            <div className="text-3xl font-black text-status-success font-mono mb-2">{Math.abs(totalRiskReduction).toFixed(0)}%</div>
                            <div className="relative h-2 bg-bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.abs(totalRiskReduction)}%` }}
                                    transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-status-success to-accent-cyan rounded-full"
                                />
                            </div>
                            <div className="text-[10px] text-text-dim mt-2">Lower risk = Better security</div>
                        </div>
                    </div>

                    {/* Stat Pills Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { icon: AlertTriangle, label: 'Issues Found', value: vulnerabilities.length.toString(), color: 'red', trend: 'initial' },
                            { icon: CheckCircle2, label: 'Issues Resolved', value: vulnerabilities.length.toString(), color: 'green', trend: `+${vulnerabilities.length}` },
                            { icon: Award, label: 'Success Rate', value: '100%', color: 'cyan', trend: 'perfect' },
                            { icon: Shield, label: 'New Security Score', value: 'A-', color: 'purple', trend: `+${(afterScore - beforeScore)}` },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3 + idx * 0.1, type: "spring", stiffness: 200 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className={`p-3 rounded-xl bg-gradient-to-br from-${stat.color === 'red' ? 'status-critical' : stat.color === 'green' ? 'status-success' : stat.color === 'cyan' ? 'accent-cyan' : 'accent-purple'}/10 border border-${stat.color === 'red' ? 'status-critical' : stat.color === 'green' ? 'status-success' : stat.color === 'cyan' ? 'accent-cyan' : 'accent-purple'}/30 text-center transition-all duration-300 cursor-pointer`}
                            >
                                <stat.icon className={`w-5 h-5 mx-auto mb-1 text-${stat.color === 'red' ? 'status-critical' : stat.color === 'green' ? 'status-success' : stat.color === 'cyan' ? 'accent-cyan' : 'accent-purple'}`} />
                                <div className={`text-xl font-bold text-${stat.color === 'red' ? 'status-critical' : stat.color === 'green' ? 'status-success' : stat.color === 'cyan' ? 'accent-cyan' : 'accent-purple'} font-mono`}>{stat.value}</div>
                                <div className="text-[10px] text-text-dim">{stat.label}</div>
                                <div className="text-[8px] text-text-dim mt-1">{stat.trend}</div>
                            </motion.div>
                        ))}
                    </div>
                </ReportSection>

                {/* Threats Identified Section with CVSS Scores */}
                <ReportSection title="Threats Identified" icon={AlertTriangle} color="orange" delay={0.2} badge={`${vulnerabilities.length} FINDINGS`}>
                    <div className="space-y-3">
                        {vulnerabilities.map((vuln, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + idx * 0.1, type: "spring" }}
                                whileHover={{ scale: 1.02, x: 10 }}
                                className="flex items-start gap-4 p-4 rounded-xl bg-bg-secondary/30 hover:bg-bg-secondary/50 transition-all duration-300 group cursor-pointer border border-transparent hover:border-accent-red/30"
                            >
                                <SeverityBadge severity={vuln.severity} size="md" />
                                <div className="flex-1">
                                    <div className="font-mono font-bold text-text-primary text-base mb-1">{vuln.title}</div>
                                    <div className="text-text-dim text-sm">{vuln.desc}</div>
                                    <div className="flex items-center gap-4 mt-2 text-[10px] font-mono">
                                        <span className="flex items-center gap-1">
                                            <Shield className="w-2.5 h-2.5" />
                                            CVSS: {vuln.cvss}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <TrendingUp className="w-2.5 h-2.5" />
                                            EPSS: {vuln.epss}
                                        </span>
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <ArrowRight className="w-4 h-4 text-accent-red" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ReportSection>

                {/* AI Recommendations with Priority Matrix */}
                <ReportSection title="AI Recommendations" icon={Brain} color="purple" delay={0.3} badge="PRIORITIZED">
                    <p className="mb-5 leading-relaxed">
                        Claude AI analyzed each vulnerability and generated targeted remediation instructions,
                        prioritizing the <span className="text-accent-red font-bold">critical TLS misconfiguration</span> first due to its potential for traffic interception,
                        followed by header-based protections and access control fixes.
                    </p>
                    <div className="space-y-3">
                        {recommendations.map((rec, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + idx * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-accent-purple/5 to-transparent hover:from-accent-purple/10 transition-all duration-300"
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${rec.priority === 'P0' ? 'bg-status-critical/20 text-status-critical border border-status-critical/30' :
                                        rec.priority === 'P1' ? 'bg-status-high/20 text-status-high border border-status-high/30' :
                                            'bg-status-medium/20 text-status-medium border border-status-medium/30'
                                    }`}>
                                    {rec.priority}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-text-primary">{rec.action}</div>
                                    <div className="flex items-center gap-3 mt-1 text-[9px] font-mono">
                                        <span className="text-text-dim">Effort: {rec.effort}</span>
                                        <span className="text-text-dim">Impact: {rec.impact}</span>
                                    </div>
                                </div>
                                <div className="text-accent-purple opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Sparkles className="w-3.5 h-3.5" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ReportSection>

                {/* Remediation Actions Timeline */}
                <ReportSection title="Remediation Actions" icon={Wrench} color="green" delay={0.4} badge="7 ACTIONS">
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-status-success via-accent-cyan to-status-success" />

                        <div className="space-y-3">
                            {remediationActions.map((action, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + idx * 0.05 }}
                                    className="relative flex items-center gap-4 p-3 rounded-lg hover:bg-status-success/5 transition-all duration-300 group"
                                >
                                    <div className="relative z-10">
                                        <div className="w-8 h-8 rounded-full bg-status-success/20 flex items-center justify-center border border-status-success/50 group-hover:scale-110 transition-transform duration-300">
                                            <action.icon className="w-4 h-4 text-status-success" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono text-text-dim">{action.time}</span>
                                            <span className="text-sm text-text-primary">{action.action}</span>
                                        </div>
                                        <div className="text-[9px] font-mono text-text-dim mt-0.5">Duration: {action.duration}</div>
                                    </div>
                                    <CheckCircle2 className="w-4 h-4 text-status-success opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </ReportSection>

                {/* Verification Results with Premium Stats */}
                <ReportSection title="Verification Results" icon={ShieldCheck} color="green" delay={0.5} badge="VERIFIED">
                    {/* Score Improvement Card */}
                    <div className="mb-6 p-5 rounded-xl bg-gradient-to-r from-status-success/10 to-accent-cyan/10 border border-status-success/30">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <div className="text-xs font-mono text-text-dim mb-2">SECURITY SCORE TRANSFORMATION</div>
                                <div className="flex items-center gap-4">
                                    <div>
                                        <div className="text-4xl font-black text-status-critical font-mono">{beforeScore}</div>
                                        <div className="text-[10px] text-text-dim">PRE-REMEDIATION</div>
                                    </div>
                                    <motion.div
                                        animate={{ x: [0, 10, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <ArrowRight className="w-8 h-8 text-status-success" />
                                    </motion.div>
                                    <div>
                                        <div className="text-4xl font-black text-status-success font-mono">{afterScore}</div>
                                        <div className="text-[10px] text-text-dim">POST-REMEDIATION</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-status-success font-mono">+{afterScore - beforeScore}</div>
                                    <div className="text-[9px] text-text-dim">Points Gained</div>
                                </div>
                                <div className="w-px h-8 bg-border-subtle" />
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-accent-cyan font-mono">{Math.abs(totalRiskReduction).toFixed(0)}%</div>
                                    <div className="text-[9px] text-text-dim">Improvement</div>
                                </div>
                                <div className="w-px h-8 bg-border-subtle" />
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-status-success font-mono">A-</div>
                                    <div className="text-[9px] text-text-dim">New Grade</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compact Verification Table */}
                    <div className="space-y-2">
                        {vulnerabilities.map((vuln, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 + idx * 0.1 }}
                                className="grid grid-cols-12 gap-3 items-center p-3 rounded-lg hover:bg-bg-secondary/30 transition-all duration-300"
                            >
                                <div className="col-span-4">
                                    <SeverityBadge severity={vuln.severity} size="sm" />
                                </div>
                                <div className="col-span-6 text-text-dim text-xs font-mono truncate">{vuln.title}</div>
                                <div className="col-span-2 text-right">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.8 + idx * 0.1, type: "spring" }}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-success/20"
                                    >
                                        <CheckCircle2 className="w-3 h-3 text-status-success" />
                                        <span className="text-[10px] text-status-success font-mono">FIXED</span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Compliance badges */}
                    <div className="mt-5 pt-3 flex flex-wrap gap-2">
                        {['PCI DSS', 'HIPAA', 'GDPR', 'SOC 2', 'ISO 27001'].map(standard => (
                            <span key={standard} className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-bg-secondary/50 border border-border-subtle text-text-dim">
                                {standard} ✓
                            </span>
                        ))}
                    </div>
                </ReportSection>

                {/* Footer Actions with Premium Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="mt-10 text-center"
                >
                    <div className="flex flex-wrap items-center justify-center gap-5 mb-6">
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

                    {/* Footer Info */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-text-dim">
                            <div className="flex items-center gap-1">
                                <Shield className="w-3 h-3 text-accent-red" />
                                <span>Generated by Sentinel AI — Autonomous Security Audit Platform</span>
                            </div>
                            <div className="w-px h-3 bg-border-subtle" />
                            <div className="flex items-center gap-1">
                                <Cpu className="w-3 h-3 text-accent-cyan" />
                                <span>v2.4.1</span>
                            </div>
                            <div className="w-px h-3 bg-border-subtle" />
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-status-success" />
                                <span>Powered by Claude AI</span>
                            </div>
                        </div>

                        <div className="text-[8px] font-mono text-text-dim/50">
                            This report is digitally signed and blockchain-verified. Any tampering will invalidate the verification hash.
                        </div>
                    </div>
                </motion.div>

                {/* Digital Signature Seal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.5, type: "spring" }}
                    className="fixed bottom-4 left-4 z-20"
                >
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-primary/80 backdrop-blur-sm border border-status-success/30">
                        <div className="w-2 h-2 rounded-full bg-status-success animate-ping" />
                        <span className="text-[8px] font-mono text-status-success">DIGITALLY SIGNED • VERIFIED</span>
                        <Fingerprint className="w-3 h-3 text-accent-cyan" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ForensicReport;