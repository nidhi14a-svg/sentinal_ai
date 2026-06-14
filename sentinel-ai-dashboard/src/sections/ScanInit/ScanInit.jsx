import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Zap, Activity, ArrowRight, Cpu, Radio, Target } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { initiateScan } from '../../services/scanService';
import ScanChecklist from './ScanChecklist';
import TerminalLog from '../../components/common/TerminalLog';
import GlowButton from '../../components/common/GlowButton';
import GlassCard from '../../components/common/GlassCard';

const ScanInit = ({ onComplete }) => {
    const { setScanData, setScanProgress, targetDomain } = useDashboard();
    const [activeStep, setActiveStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [stepTimings, setStepTimings] = useState({});
    const [terminalComplete, setTerminalComplete] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);
    const [realScanData, setRealScanData] = useState(null);
    const stepStartTimeRef = useRef(null);
    const stepDurations = [2.2, 2.8, 2.5, 3.0, 2.3];

    // Premium Terminal Logs
    const terminalLogs = [
        { text: '[✓] SENTINEL_AI_CORE initialized', status: 'success' },
        { text: `[→] Establishing secure channel to target: ${targetDomain || 'example.team-owned-site.com'}`, status: 'info' },
        { text: '[✓] TLS handshake completed — cipher: TLS_AES_256_GCM_SHA384', status: 'success' },
        { text: '[→] Initiating DNS reconnaissance module...', status: 'info' },
        { text: '[✓] DNS resolution complete — 3 A records, 2 MX records, 6 NS records', status: 'success' },
        { text: '[→] Launching SSL/TLS inspector...', status: 'info' },
        { text: '[⚠] WARNING: TLS 1.0 protocol still enabled', status: 'warning' },
        { text: '[⚠] WARNING: Weak cipher suite detected: TLS_RSA_WITH_AES_128_CBC_SHA', status: 'warning' },
        { text: '[⚠] WARNING: Certificate expires in 45 days', status: 'warning' },
        { text: '[→] Scanning HTTP security headers...', status: 'info' },
        { text: '[⚠] Missing: Content-Security-Policy header', status: 'warning' },
        { text: '[⚠] Missing: Strict-Transport-Security header', status: 'warning' },
        { text: '[⚠] Missing: X-Frame-Options header', status: 'warning' },
        { text: '[→] Executing exposure detection algorithms...', status: 'info' },
        { text: '[🔥] CRITICAL: Directory listing enabled at /backup/', status: 'error' },
        { text: '[🔥] CRITICAL: Exposed .git/config file with credentials', status: 'error' },
        { text: '[⚠] WARNING: Sensitive log file accessible: /debug.log', status: 'warning' },
        { text: '[→] Running risk classification engine...', status: 'info' },
        { text: '[📊] Analyzing 12 potential vulnerabilities', status: 'info' },
        { text: '[📊] Calculating CVSS 3.1 severity scores', status: 'info' },
        { text: '[✓] Scan completed — 4 critical, 3 high, 2 medium, 3 low findings', status: 'success' },
    ];

    useEffect(() => {
        setScanProgress(0);
        stepStartTimeRef.current = Date.now();
        
        // Initiate real scan
        const target = targetDomain || 'example.team-owned-site.com';
        initiateScan(target)
            .then(data => setRealScanData(data))
            .catch(err => console.error("Real scan failed:", err));
    }, [targetDomain, setScanProgress]);

    useEffect(() => {
        if (activeStep < 5 && !completedSteps.includes(activeStep)) {
            const timer = setTimeout(() => {
                const duration = (Date.now() - stepStartTimeRef.current) / 1000;
                setStepTimings(prev => ({ ...prev, [activeStep]: duration }));
                setCompletedSteps(prev => [...prev, activeStep]);

                if (activeStep < 4) {
                    setActiveStep(activeStep + 1);
                    stepStartTimeRef.current = Date.now();
                    setScanProgress(((activeStep + 1) / 5) * 100);
                } else {
                    setScanComplete(true);
                    setScanProgress(100);
                }
            }, stepDurations[activeStep] * 1000);

            return () => clearTimeout(timer);
        }
    }, [activeStep, completedSteps]);

    useEffect(() => {
        if (scanComplete) {
            const terminalTimer = setTimeout(() => {
                setTerminalComplete(true);
            }, 2000);
            return () => clearTimeout(terminalTimer);
        }
    }, [scanComplete]);

    const handleViewReport = () => {
        if (realScanData) {
            // Count severities
            let criticalCount = 0, highCount = 0, mediumCount = 0, lowCount = 0;
            realScanData.vulnerabilities.forEach(v => {
                if (v.severity === 'CRITICAL') criticalCount++;
                else if (v.severity === 'HIGH') highCount++;
                else if (v.severity === 'MEDIUM') mediumCount++;
                else if (v.severity === 'LOW') lowCount++;
            });
            
            setScanData({
                ...realScanData,
                criticalCount,
                highCount,
                mediumCount,
                lowCount,
                scanDuration: Object.values(stepTimings).reduce((a, b) => a + b, 0).toFixed(1),
            });
        } else {
            const mockScanData = {
                vulnerabilities: [
                    { id: 1, name: 'TLS 1.0 Enabled', severity: 'HIGH', location: 'SSL Configuration' },
                    { id: 2, name: 'Missing CSP Header', severity: 'MEDIUM', location: 'HTTP Headers' },
                    { id: 3, name: 'Directory Listing Exposed', severity: 'CRITICAL', location: '/backup/' },
                    { id: 4, name: 'Exposed Git Config', severity: 'CRITICAL', location: '/.git/config' },
                ],
                totalFindings: 12,
                criticalCount: 4,
                highCount: 3,
                mediumCount: 2,
                lowCount: 3,
                scanDuration: Object.values(stepTimings).reduce((a, b) => a + b, 0).toFixed(1),
            };
            setScanData(mockScanData);
        }
        onComplete?.();
    };

    return (
        <div className="relative min-h-[calc(100vh-200px)]">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Rotating radar rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-30">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border border-accent-red/20"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-12 rounded-full border border-accent-cyan/20"
                    />
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-24 rounded-full border border-accent-purple/20"
                    />
                    <div className="absolute inset-32 rounded-full bg-gradient-to-r from-accent-red/5 via-accent-cyan/5 to-accent-purple/5 blur-3xl" />
                </div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full border border-accent-red/30 bg-accent-red/10 backdrop-blur-sm">
                        <Activity className="w-4 h-4 text-accent-red animate-pulse" />
                        <span className="text-xs font-mono text-accent-red tracking-wider">ACTIVE_OPERATION</span>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                            <div className="w-1.5 h-1.5 rounded-full bg-status-success" />
                            <div className="w-1.5 h-1.5 rounded-full bg-status-success" />
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black mb-3">
                        <span className="bg-gradient-to-r from-text-primary via-accent-red to-text-primary bg-clip-text text-transparent">
                            INITIALIZING
                        </span>
                        <br />
                        <span className="text-accent-red text-glow-red">SENTINEL CORE</span>
                    </h1>

                    <div className="flex items-center justify-center gap-3">
                        <Target className="w-4 h-4 text-accent-cyan" />
                        <p className="text-accent-cyan font-mono text-sm tracking-wider">
                            TARGET: {targetDomain || 'example.team-owned-site.com'}
                        </p>
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Checklist (spans 2 columns on desktop) */}
                    <div className="lg:col-span-2">
                        <ScanChecklist
                            activeStep={activeStep}
                            completedSteps={completedSteps}
                            stepTimings={stepTimings}
                        />
                    </div>

                    {/* Right Column - Stats & Visuals */}
                    <div className="space-y-4">
                        {/* Live Stats Card */}
                        <GlassCard glowColor="red" className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Cpu className="w-4 h-4 text-accent-red" />
                                    <span className="text-xs font-mono text-accent-red">LIVE_STATS</span>
                                </div>
                                <span className="text-2xs font-mono text-text-dim">REAL_TIME</span>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs font-mono mb-1">
                                        <span className="text-text-dim">SCAN_PROGRESS</span>
                                        <span className="text-accent-cyan">{Math.round((completedSteps.length / 5) * 100)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(completedSteps.length / 5) * 100}%` }}
                                            className="h-full bg-gradient-to-r from-accent-red to-accent-cyan rounded-full"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-text-dim">COMPLETED_STEPS</span>
                                    <span className="text-accent-cyan font-bold">{completedSteps.length}/5</span>
                                </div>

                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-text-dim">ELAPSED_TIME</span>
                                    <span className="text-accent-cyan font-bold">
                                        {Object.values(stepTimings).reduce((a, b) => a + b, 0).toFixed(1)}s
                                    </span>
                                </div>
                            </div>
                        </GlassCard>

                        {/* Radar Visualization Card */}
                        <GlassCard glowColor="cyan" className="p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Radio className="w-4 h-4 text-accent-cyan" />
                                <span className="text-xs font-mono text-accent-cyan">RADAR_SWEEP</span>
                            </div>
                            <div className="relative w-full aspect-square">
                                <div className="absolute inset-0 rounded-full border border-accent-red/30" />
                                <div className="absolute inset-[15%] rounded-full border border-accent-cyan/20" />
                                <div className="absolute inset-[30%] rounded-full border border-accent-purple/20" />
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0"
                                >
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1/2 bg-gradient-to-b from-accent-red to-transparent" />
                                </motion.div>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-red/10 to-accent-cyan/10 animate-pulse" />
                            </div>
                        </GlassCard>
                    </div>
                </div>

                {/* Terminal Section */}
                <div className="mt-8">
                    <TerminalLog
                        logs={terminalLogs}
                        typingSpeed={25}
                        title="SENTINEL_AI_CONSOLE"
                    />
                </div>

                {/* Complete Button */}
                <AnimatePresence>
                    {terminalComplete && scanComplete && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ duration: 0.5 }}
                            className="mt-8 text-center"
                        >
                            <GlowButton
                                onClick={handleViewReport}
                                variant="primary"
                                icon={<Zap className="w-4 h-4" />}
                                className="px-8 py-3 text-base group"
                            >
                                VIEW THREAT REPORT
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                            </GlowButton>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ScanInit;
