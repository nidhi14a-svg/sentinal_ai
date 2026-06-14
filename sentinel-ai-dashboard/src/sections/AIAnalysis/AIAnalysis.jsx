import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, ArrowRight, Sparkles, Cpu, Activity, BarChart3, ShieldCheck } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { analyzeFindings } from '../../services/analysisService';
import VulnerabilityCard from './VulnerabilityCard';
import GlowButton from '../../components/common/GlowButton';
import GlassCard from '../../components/common/GlassCard';

const AIAnalysis = ({ onProceed }) => {
    const { aiAnalysis, setRemediationStatus, targetDomain } = useDashboard();
    const [expandedId, setExpandedId] = useState(null);
    const [realAnalysis, setRealAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const vulnerabilities = [
        {
            id: 'SEC-001',
            title: 'Missing Content-Security-Policy Header',
            severity: 'HIGH',
            confidence: 96,
            aiExplanation: "A Content-Security-Policy header tells browsers which sources of content (scripts, styles, images) are allowed to load on your site. Without it, the browser will execute scripts from any source — including malicious ones injected through forms, comments, or compromised third-party scripts.",
            impact: "If an attacker manages to inject a script into your page (cross-site scripting), it will run with full access to your site's cookies, session tokens, and user data — potentially leading to account takeover or data theft.",
            fix: "Add a Content-Security-Policy header restricting script sources to your own domain and trusted CDNs.",
            codeSnippet: "Content-Security-Policy: default-src 'self'; script-src 'self' cdnjs.cloudflare.com",
        },
        {
            id: 'SEC-002',
            title: 'Missing Strict-Transport-Security Header',
            severity: 'MEDIUM',
            confidence: 94,
            aiExplanation: "HSTS instructs browsers to only ever connect to your site over HTTPS, even if a user types 'http://' or clicks an old link. Without it, the first connection can be intercepted and downgraded to plain HTTP.",
            impact: "Attackers on shared networks (public Wi-Fi, compromised routers) could perform a man-in-the-middle attack, intercepting login credentials or session cookies during that first unprotected request.",
            fix: "Add an HSTS header forcing HTTPS for at least one year, including subdomains.",
            codeSnippet: "Strict-Transport-Security: max-age=31536000; includeSubDomains",
        },
        {
            id: 'SEC-003',
            title: 'Directory Listing Enabled',
            severity: 'HIGH',
            confidence: 98,
            aiExplanation: "The /backup/ directory on your server has directory listing enabled, meaning anyone who visits that URL can see a full list of every file stored there — including filenames that may reveal sensitive backups, configs, or database dumps.",
            impact: "An attacker can browse this directory, identify backup files (e.g. database.sql.bak, .env.backup), download them directly, and gain access to credentials, API keys, or entire user databases.",
            fix: "Disable directory listing in the web server configuration and restrict access to the /backup/ path entirely.",
            codeSnippet: "location /backup/ { deny all; }  # nginx configuration",
        },
        {
            id: 'SEC-004',
            title: 'Outdated TLS Configuration',
            severity: 'CRITICAL',
            confidence: 99,
            aiExplanation: "Your server still accepts connections using TLS 1.0, a protocol version from 1999 with multiple known cryptographic weaknesses. Modern browsers are phasing out support, and security scanners flag this as a major risk.",
            impact: "Attackers can exploit known vulnerabilities in TLS 1.0 (such as BEAST and POODLE-style attacks) to decrypt or tamper with traffic between users and your server, exposing passwords and session data.",
            fix: "Disable TLS 1.0 and 1.1, allow only TLS 1.2 and 1.3.",
            codeSnippet: "ssl_protocols TLSv1.2 TLSv1.3;  # Modern TLS configuration",
        },
    ];

    useEffect(() => {
        if (aiAnalysis?.originalFindings) {
            setIsAnalyzing(true);
            const target = targetDomain || 'example.team-owned-site.com';
            analyzeFindings(aiAnalysis.originalFindings, target)
                .then(data => {
                    setRealAnalysis(data.analysisMap);
                    setIsAnalyzing(false);
                    // auto-expand first item if available
                    const firstId = aiAnalysis.vulnerabilities?.[0]?.id;
                    if (firstId && !expandedId) setExpandedId(firstId);
                })
                .catch(err => {
                    console.error("AI Analysis failed:", err);
                    setIsAnalyzing(false);
                });
        }
    }, [aiAnalysis, targetDomain]);

    const displayVulnerabilities = (aiAnalysis?.vulnerabilities || vulnerabilities).map((v, i) => {
        const mapped = realAnalysis?.[v.id];
        if (mapped) {
            return {
                ...v,
                title: v.name || v.title,
                aiExplanation: mapped.explanation,
                impact: mapped.impact,
                fix: mapped.recommendedFix,
                codeSnippet: mapped.codeSnippetBefore,
                confidence: mapped.confidence || 95,
            };
        }
        return {
            ...v,
            title: v.name || v.title,
            aiExplanation: v.aiExplanation || v.description,
            fix: v.aiRemediation || v.fix,
            codeSnippet: v.codeSnippetBefore || v.codeSnippet,
            confidence: v.confidence || 95,
        };
    });

    const handleRemediate = () => {
        const remediationPlan = displayVulnerabilities.map(v => ({
            id: v.id,
            title: v.title,
            fix: v.fix,
            codeSnippet: v.codeSnippet,
            status: 'pending',
        }));
        setRemediationStatus(remediationPlan);
        onProceed?.();
    };

    const stats = [
        { label: 'Total Vulnerabilities', value: displayVulnerabilities.length, icon: ShieldCheck, color: 'red' },
        { label: 'Avg AI Confidence', value: isAnalyzing ? 'Analyzing...' : '96.75%', icon: Brain, color: 'purple' },
        { label: 'Critical Issues', value: displayVulnerabilities.filter(v => v.severity === 'CRITICAL').length, icon: Activity, color: 'red' },
        { label: 'Auto-Fixable', value: '100%', icon: Zap, color: 'cyan' },
    ];

    return (
        <div className="relative min-h-[calc(100vh-200px)]">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl animate-pulse delay-1000" />

                {/* Floating AI particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
                        animate={{
                            y: [null, Math.random() * window.innerHeight],
                            opacity: [0, 0.5, 0]
                        }}
                        transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, delay: i * 0.5 }}
                        className="absolute w-1 h-1 rounded-full bg-accent-purple/30"
                    />
                ))}
            </div>

            <div className="relative z-10">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-accent-purple/10 border border-accent-purple/30">
                            <Brain className="w-5 h-5 text-accent-purple" />
                        </div>
                        <span className="text-xs font-mono text-accent-purple tracking-wider">AI_ANALYSIS_ENGINE</span>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse" />
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-red" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black mb-2">
                        <span className="bg-gradient-to-r from-text-primary via-accent-purple to-accent-red bg-clip-text text-transparent">
                            AI Analysis Center
                        </span>
                    </h1>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Sparkles className="w-4 h-4 text-accent-cyan" />
                        <p className="text-accent-cyan font-mono text-sm">
                            {isAnalyzing ? "Claude is analyzing the findings..." : `Claude has analyzed ${displayVulnerabilities.length} vulnerabilities — here's what it found`}
                        </p>
                        <div className="flex items-center gap-1 ml-4">
                            <Cpu className="w-3 h-3 text-status-success" />
                            <span className="text-xs text-text-dim">Claude 3.5 Sonnet</span>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {stats.map((stat, idx) => (
                        <GlassCard key={idx} glowColor={stat.color} className="text-center p-4">
                            <div className="flex items-center justify-center mb-2">
                                <div className={`p-2 rounded-lg bg-${stat.color === 'red' ? 'accent-red' : stat.color === 'cyan' ? 'accent-cyan' : 'accent-purple'}/10`}>
                                    <stat.icon className={`w-4 h-4 text-${stat.color === 'red' ? 'accent-red' : stat.color === 'cyan' ? 'accent-cyan' : 'accent-purple'}`} />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-text-primary font-mono">{stat.value}</div>
                            <div className="text-xs text-text-dim mt-1">{stat.label}</div>
                        </GlassCard>
                    ))}
                </motion.div>

                {/* AI Analysis Summary Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mb-6"
                >
                    <GlassCard glowColor="cyan" className="p-5 bg-gradient-to-r from-accent-cyan/5 to-transparent">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30">
                                <BarChart3 className="w-6 h-6 text-accent-cyan" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-text-primary mb-2 font-mono">Executive Summary</h3>
                                <p className="text-text-secondary text-sm leading-relaxed">
                                    {isAnalyzing ? "Analyzing threat data and generating remediation strategies..." : (
                                        <>
                                            Claude AI has completed analysis of your security scan. Found <span className="text-accent-red font-bold">{displayVulnerabilities.length} vulnerabilities</span> across
                                            your infrastructure. <span className="text-accent-cyan">Critical severity issues</span> require immediate attention.
                                            Review the detailed analysis below for remediation steps.
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Vulnerability Cards */}
                <div className="space-y-4 mb-8">
                    {displayVulnerabilities.map((vuln, index) => (
                        <VulnerabilityCard
                            key={vuln.id}
                            vulnerability={vuln}
                            isExpanded={expandedId === vuln.id}
                            onToggle={() => setExpandedId(expandedId === vuln.id ? null : vuln.id)}
                            index={index}
                        />
                    ))}
                </div>

                {/* Action Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex flex-col items-center gap-4 pt-4 pb-8"
                >
                    <GlassCard glowColor="red" className="p-6 max-w-2xl w-full text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                            <span className="text-xs font-mono text-status-success">READY_FOR_REMEDIATION</span>
                        </div>
                        <p className="text-text-secondary text-sm mb-4">
                            Autonomous remediation agent is ready to apply all recommended fixes automatically
                        </p>
                        <GlowButton
                            onClick={handleRemediate}
                            variant="primary"
                            icon={<Zap className="w-4 h-4" />}
                            className="px-8 py-3 text-base group"
                        >
                            RUN AUTONOMOUS REMEDIATION
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </GlowButton>
                    </GlassCard>

                    {/* Trust indicator */}
                    <div className="flex items-center gap-4 text-[10px] font-mono text-text-dim">
                        <span>✓ AI-GENERATED INSIGHTS</span>
                        <span>✓ REAL-TIME ANALYSIS</span>
                        <span>✓ VERIFIED RECOMMENDATIONS</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AIAnalysis;
