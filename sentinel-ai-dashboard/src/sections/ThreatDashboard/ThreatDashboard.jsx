import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Shield, Target, Cpu, Activity, AlertOctagon } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import ThreatStats from './ThreatStats';
import ThreatGraph from './ThreatGraph';
import GlassCard from '../../components/common/GlassCard';
import SeverityBadge from '../../components/common/SeverityBadge';
import GlowButton from '../../components/common/GlowButton';

const ThreatDashboard = ({ onProceed }) => {
    const { scanData, setAiAnalysis, targetDomain } = useDashboard();
    const [selectedVuln, setSelectedVuln] = useState(null);
    const [resolvedCount] = useState(0); // Will be updated after remediation

    const vulnerabilities = [
        {
            id: 'SEC-001',
            title: 'Missing Content-Security-Policy Header',
            severity: 'HIGH',
            description: 'No CSP header detected — allows arbitrary script execution if XSS is present',
            impact: 'Attackers can inject malicious scripts',
            cvss: '7.2',
            location: 'HTTP Headers',
        },
        {
            id: 'SEC-002',
            title: 'Missing Strict-Transport-Security Header',
            severity: 'MEDIUM',
            description: 'HSTS not enforced — connections can be downgraded to HTTP',
            impact: 'Man-in-the-middle attacks possible',
            cvss: '5.8',
            location: 'HTTP Headers',
        },
        {
            id: 'SEC-003',
            title: 'Directory Listing Enabled',
            severity: 'HIGH',
            description: '/backup/ directory exposes file listing to any visitor',
            impact: 'Sensitive file exposure',
            cvss: '7.5',
            location: 'Web Server Config',
        },
        {
            id: 'SEC-004',
            title: 'Outdated TLS Configuration',
            severity: 'CRITICAL',
            description: 'TLS 1.0 still enabled — vulnerable to known protocol attacks',
            impact: 'Connection decryption possible',
            cvss: '8.1',
            location: 'SSL/TLS Config',
        },
    ];

    const displayVulnerabilities = scanData?.vulnerabilities || vulnerabilities;

    const handleAnalyze = () => {
        const analysisData = {
            vulnerabilities: displayVulnerabilities,
            summary: `Found ${displayVulnerabilities.length} vulnerabilities`,
            originalFindings: scanData?.originalFindings || null,
        };
        setAiAnalysis(analysisData);
        onProceed?.();
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 200 }
        })
    };

    return (
        <div className="relative min-h-[calc(100vh-200px)]">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-96 h-96 bg-accent-red/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-accent-cyan/5 rounded-full blur-3xl animate-pulse delay-1000" />
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
                        <div className="p-2 rounded-lg bg-accent-red/10 border border-accent-red/30">
                            <AlertOctagon className="w-5 h-5 text-accent-red" />
                        </div>
                        <span className="text-xs font-mono text-accent-red tracking-wider">THREAT_INTELLIGENCE</span>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-status-critical animate-pulse" />
                            <div className="w-1.5 h-1.5 rounded-full bg-status-high" />
                            <div className="w-1.5 h-1.5 rounded-full bg-status-medium" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black mb-2">
                        <span className="bg-gradient-to-r from-text-primary to-accent-red bg-clip-text text-transparent">
                            Threat Discovery
                        </span>
                    </h1>

                    <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-accent-cyan" />
                        <p className="text-accent-cyan font-mono text-sm">
                            Scan complete — {targetDomain || 'sample-domain.com'}
                        </p>
                        <div className="flex items-center gap-1 ml-4">
                            <Activity className="w-3 h-3 text-status-success" />
                            <span className="text-xs text-text-dim">4 minutes ago</span>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Row */}
                <div className="mb-8">
                    <ThreatStats resolvedCount={resolvedCount} />
                </div>

                {/* Threat Graph Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mb-8"
                >
                    <GlassCard glowColor="cyan" className="overflow-hidden">
                        <div className="px-6 pt-6 pb-3 border-b border-accent-cyan/20">
                            <div className="flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-accent-cyan" />
                                <span className="text-xs font-mono text-accent-cyan tracking-wider">THREAT_RELATIONSHIP_MAP</span>
                                <div className="flex-1" />
                                <span className="text-[10px] font-mono text-text-dim">REAL_TIME_ANALYSIS</span>
                            </div>
                        </div>
                        <ThreatGraph />
                    </GlassCard>
                </motion.div>

                {/* Vulnerability Cards Grid */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-text-primary mb-1">Detected Vulnerabilities</h2>
                            <p className="text-xs text-text-dim font-mono">Click on any card to view detailed analysis</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="px-2 py-1 rounded bg-bg-secondary/50 border border-border-subtle">
                                <span className="text-xs font-mono text-text-dim">{displayVulnerabilities.length} findings</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {displayVulnerabilities.map((vuln, index) => (
                            <motion.div
                                key={vuln.id}
                                custom={index}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                                onClick={() => setSelectedVuln(vuln.id === selectedVuln ? null : vuln.id)}
                                className="cursor-pointer"
                            >
                                <GlassCard
                                    glowColor={
                                        vuln.severity === 'CRITICAL' ? 'red' :
                                            vuln.severity === 'HIGH' ? 'cyan' : 'purple'
                                    }
                                    className={`
                    transition-all duration-300 hover:shadow-glowRed
                    ${selectedVuln === vuln.id ? 'ring-2 ring-accent-red shadow-glowRed' : ''}
                  `}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <SeverityBadge severity={vuln.severity} size="sm" />
                                            <span className="text-xs font-mono text-text-dim">{vuln.id}</span>
                                        </div>
                                        <div className="px-2 py-0.5 rounded bg-bg-secondary/50">
                                            <span className="text-xs font-mono text-text-dim">CVSS {vuln.score || vuln.cvss}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-base font-bold text-text-primary mb-2 font-mono">
                                        {vuln.name || vuln.title}
                                    </h3>

                                    <p className="text-text-secondary text-sm mb-3 leading-relaxed">
                                        {vuln.description}
                                    </p>

                                    <div className="flex items-center gap-4 pt-3 border-t border-border-subtle">
                                        <div className="flex items-center gap-1">
                                            <Shield className="w-3 h-3 text-text-dim" />
                                            <span className="text-xs text-text-dim">{vuln.component || vuln.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <AlertOctagon className="w-3 h-3 text-status-critical" />
                                            <span className="text-xs text-status-critical">
                                                {(vuln.impact || 'High').split(' ')[0]} risk
                                            </span>
                                        </div>
                                    </div>

                                    {/* Expanded details */}
                                    {selectedVuln === vuln.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-3 pt-3 border-t border-accent-red/20"
                                        >
                                            <p className="text-xs text-text-dim font-mono">
                                                <span className="text-accent-red">→ Impact:</span> {vuln.impact || vuln.description}
                                            </p>
                                            <p className="text-xs text-text-dim font-mono mt-1">
                                                <span className="text-accent-cyan">→ Recommended:</span> Fix immediately
                                            </p>
                                        </motion.div>
                                    )}
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Action Button */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="flex justify-center pt-4 pb-8"
                >
                    <GlowButton
                        onClick={handleAnalyze}
                        variant="primary"
                        icon={<Zap className="w-4 h-4" />}
                        className="px-8 py-3 text-base group"
                    >
                        ANALYZE WITH AI
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </GlowButton>
                </motion.div>
            </div>
        </div>
    );
};

export default ThreatDashboard;
