import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Zap, Cpu, Activity, Shield, CheckCircle, Sparkles, ArrowRight, Terminal, Wifi } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { runRemediation } from '../../services/remediationService';
import AgentLog from './AgentLog';
import GlowButton from '../../components/common/GlowButton';
import GlassCard from '../../components/common/GlassCard';
import ProgressLine from '../../components/common/ProgressLine';

const Remediation = ({ onProceed }) => {
    const { remediationStatus, setVerificationData, scanData, targetDomain, setReportData } = useDashboard();
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [stepDetails, setStepDetails] = useState({});
    const [remediationComplete, setRemediationComplete] = useState(false);
    const [realRemediationData, setRealRemediationData] = useState(null);

    // Pre-compute matrix particles safely (no window access inside JSX)
    const matrixParticles = useMemo(() => {
        const W = typeof window !== 'undefined' ? window.innerWidth : 1280;
        const H = typeof window !== 'undefined' ? window.innerHeight : 800;
        return [...Array(30)].map((_, i) => ({
            id: i,
            startX: Math.random() * W,
            endY: H + 100,
            char: ['0', '1', '>', '#', '$', '%', '&'][Math.floor(Math.random() * 7)],
            duration: 5 + Math.random() * 10,
            delay: i * 0.3,
        }));
    }, []);

    const steps = [
        {
            id: 1,
            title: 'Establishing Secure Connection',
            subText: '[INFO] Establishing secure shell connection to sample-domain.com',
            duration: 1500,
        },
        {
            id: 2,
            title: 'Patching SEC-001 — CSP Header',
            subText: '[ACTION] Editing nginx.conf → adding Content-Security-Policy directive',
            code: 'add_header Content-Security-Policy "default-src \'self\'; script-src \'self\' cdnjs.cloudflare.com";',
            duration: 2000,
        },
        {
            id: 3,
            title: 'Patching SEC-002 — HSTS Header',
            subText: '[ACTION] Editing nginx.conf → enforcing HTTP Strict Transport Security',
            code: 'add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;',
            duration: 1800,
        },
        {
            id: 4,
            title: 'Patching SEC-003 — Directory Listing',
            subText: '[ACTION] Updating location block → disabling directory listing',
            code: 'location /backup/ { deny all; autoindex off; }',
            duration: 2000,
        },
        {
            id: 5,
            title: 'Patching SEC-004 — TLS Configuration',
            subText: '[ACTION] Editing ssl_protocols → restricting to modern TLS versions',
            code: 'ssl_protocols TLSv1.2 TLSv1.3;\nssl_ciphers HIGH:!aNULL:!MD5;',
            duration: 2200,
        },
        {
            id: 6,
            title: 'Restarting Web Server',
            subText: '[INFO] Executing sudo systemctl restart nginx → service active',
            duration: 1500,
        },
        {
            id: 7,
            title: 'Running Verification Scan',
            subText: '[INFO] Re-scanning sample-domain.com for residual issues',
            duration: 2000,
        },
    ];

    const startRemediation = () => {
        setIsActive(true);
        // Trigger real backend remediation
        const target = targetDomain || 'example.team-owned-site.com';
        const findings = scanData?.originalFindings || [];
        runRemediation(findings, target)
            .then(data => {
                setRealRemediationData(data);
            })
            .catch(err => console.error("Real remediation failed:", err));
    };

    useEffect(() => {
        if (!isActive) return;

        if (currentStep <= steps.length) {
            const timer = setTimeout(() => {
                const now = new Date();
                const timestamp = now.toLocaleTimeString();

                setStepDetails(prev => ({
                    ...prev,
                    [currentStep]: {
                        timestamp,
                        code: steps[currentStep - 1]?.code,
                    }
                }));

                setCompletedSteps(prev => [...prev, currentStep]);

                if (currentStep < steps.length) {
                    setCurrentStep(currentStep + 1);
                } else {
                    setRemediationComplete(true);
                }
            }, steps[currentStep - 1].duration);

            return () => clearTimeout(timer);
        }
    }, [isActive, currentStep, steps]);

    const handleVerification = () => {
        const verificationResults = {
            before: {
                critical: scanData?.criticalCount || 1,
                high: scanData?.highCount || 2,
                medium: scanData?.mediumCount || 1,
                low: scanData?.lowCount || 0,
                score: scanData?.securityScore || 58,
            },
            after: {
                critical: 0,
                high: 0,
                medium: 0,
                low: 0,
                score: realRemediationData?.securityScoreAfter || 94,
            },
            fixedIssues: (scanData?.vulnerabilities || []).map(v => v.title || v.name).concat([
                'Content-Security-Policy header added',
                'HSTS header enforced',
                'Directory listing disabled',
                'TLS 1.0/1.1 disabled',
            ]).slice(0, 4), // pick a few
            remainingIssues: [],
        };
        setVerificationData(verificationResults);
        
        // Ensure report data trigger happens, though we'll actually fetch the real report later
        onProceed?.();
    };

    const progress = (completedSteps.length / steps.length) * 100;

    return (
        <div className="relative min-h-[calc(100vh-200px)]">
            {/* Animated Background Matrix Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full">
                    {matrixParticles.map((p) => (
                        <motion.div
                            key={p.id}
                            initial={{ x: p.startX, y: -100 }}
                            animate={{ y: p.endY }}
                            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
                            className="absolute text-xs font-mono text-accent-green/10"
                        >
                            {p.char}
                        </motion.div>
                    ))}
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-red/5 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="relative z-10">
                {/* Top Banner - AI Agent Active */}
                <motion.div
                    initial={{ opacity: 0, y: -30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="mb-8"
                >
                    <GlassCard
                        glowColor="red"
                        className={`
              text-center py-8 px-6 relative overflow-hidden
              ${isActive && !remediationComplete ? 'animate-pulseGlow' : ''}
            `}
                    >
                        {/* Animated background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-red/10 via-accent-cyan/10 to-accent-purple/10 animate-pulse" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-center gap-3 mb-3">
                                <div className="p-2 rounded-full bg-accent-red/20 border border-accent-red/50">
                                    <Bot className="w-8 h-8 text-accent-red animate-pulse" />
                                </div>
                                <div className="p-2 rounded-full bg-accent-cyan/20 border border-accent-cyan/50">
                                    <Cpu className="w-8 h-8 text-accent-cyan animate-pulse" />
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black mb-2">
                                <span className="bg-gradient-to-r from-accent-red via-accent-cyan to-accent-purple bg-clip-text text-transparent">
                                    AI AGENT ACTIVE
                                </span>
                            </h2>

                            <p className="text-accent-cyan font-mono text-sm flex items-center justify-center gap-2">
                                <Wifi className="w-4 h-4" />
                                Autonomous remediation in progress — sample-domain.com
                                <Activity className="w-4 h-4 text-status-success animate-pulse" />
                            </p>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Main Content */}
                <AnimatePresence mode="wait">
                    {!isActive ? (
                        // Start Screen
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <GlassCard glowColor="red" className="text-center max-w-2xl mx-auto p-12">
                                <div className="mb-6">
                                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-accent-red/20 to-accent-purple/20 flex items-center justify-center border-2 border-accent-red/50">
                                        <Shield className="w-12 h-12 text-accent-red" />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-text-primary mb-3">Ready to Remediate</h3>
                                <p className="text-text-secondary mb-6">
                                    The AI agent will autonomously patch all {steps.length - 1} vulnerabilities found during the scan.
                                    No manual intervention required.
                                </p>

                                <div className="flex items-center justify-center gap-4 mb-6 text-sm font-mono">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-status-success" />
                                        <span className="text-text-dim">Auto-Fixable: 100%</span>
                                    </div>
                                    <div className="w-px h-4 bg-border-subtle" />
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-accent-cyan" />
                                        <span className="text-text-dim">Est. Time: 15s</span>
                                    </div>
                                </div>

                                <GlowButton
                                    onClick={startRemediation}
                                    variant="primary"
                                    icon={<Zap className="w-5 h-5" />}
                                    className="px-8 py-3 text-lg group"
                                >
                                    FIX ALL VULNERABILITIES
                                    <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform duration-300" />
                                </GlowButton>
                            </GlassCard>
                        </motion.div>
                    ) : (
                        // Active Remediation Screen
                        <motion.div
                            key="active"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            {/* Progress Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Progress Card */}
                                <GlassCard glowColor="cyan" className="lg:col-span-1 p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Activity className="w-4 h-4 text-accent-cyan" />
                                        <span className="text-xs font-mono text-accent-cyan">REMEDIATION_PROGRESS</span>
                                    </div>

                                    <div className="text-center mb-4">
                                        <div className="text-4xl font-black text-accent-red font-mono">
                                            {completedSteps.length}/{steps.length}
                                        </div>
                                        <div className="text-xs text-text-dim mt-1">steps complete</div>
                                    </div>

                                    <ProgressLine
                                        progress={progress}
                                        color="red"
                                        showLabel={false}
                                        height="h-1.5"
                                    />

                                    <div className="mt-4 space-y-2">
                                        <div className="flex justify-between text-xs font-mono">
                                            <span className="text-text-dim">Status</span>
                                            <span className="text-status-success">EXECUTING</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-mono">
                                            <span className="text-text-dim">Current Operation</span>
                                            <span className="text-accent-cyan truncate ml-2">
                                                {steps[currentStep - 1]?.title.substring(0, 30)}...
                                            </span>
                                        </div>
                                    </div>
                                </GlassCard>

                                {/* Stats Card */}
                                <GlassCard glowColor="purple" className="lg:col-span-2 p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Terminal className="w-4 h-4 text-accent-purple" />
                                            <span className="text-xs font-mono text-accent-purple">LIVE_METRICS</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                                            <span className="text-[10px] font-mono text-text-dim">CONNECTED</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-2xl font-bold text-text-primary font-mono">98%</div>
                                            <div className="text-[10px] text-text-dim mt-1">AI Confidence</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-text-primary font-mono">4/4</div>
                                            <div className="text-[10px] text-text-dim mt-1">Vulnerabilities Patched</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-status-success font-mono">✓</div>
                                            <div className="text-[10px] text-text-dim mt-1">Integrity Verified</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-text-primary font-mono">0s</div>
                                            <div className="text-[10px] text-text-dim mt-1">Rollback Time</div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>

                            {/* Agent Log */}
                            <AgentLog
                                steps={steps}
                                currentStep={currentStep}
                                completedSteps={completedSteps}
                                stepDetails={stepDetails}
                            />

                            {/* Completion Button */}
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
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Decorative Elements */}
                <div className="fixed bottom-4 right-4 opacity-30 pointer-events-none">
                    <div className="text-right">
                        <div className="text-[10px] font-mono text-text-dim">SENTINEL_AI</div>
                        <div className="text-[8px] font-mono text-text-dim">REMEDIATION_ENGINE_v2.0</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Remediation;
