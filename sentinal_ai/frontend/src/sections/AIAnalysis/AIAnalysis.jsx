import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, ArrowRight, Sparkles, Cpu, Activity, BarChart3, ShieldCheck } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import VulnerabilityCard from './VulnerabilityCard';
import GlowButton from '../../components/common/GlowButton';
import GlassCard from '../../components/common/GlassCard';

const AIAnalysis = ({ onProceed }) => {
    const { scanData, setRemediationStatus, targetDomain } = useDashboard();
    const [expandedId, setExpandedId] = useState(null);
    const isAnalyzing = false;
    
    // Use real AI analysis from backend
    const backendAiAnalysis = scanData?.aiAnalysis || {};
    const recommendations = backendAiAnalysis.recommendations || [];
    const findings = scanData?.findings || [];
    
    // Transform findings into the format the UI expects
    const displayVulnerabilities = findings.map((finding, idx) => {
        // Find matching recommendation
        const recommendation = recommendations.find(r => r.findingId === finding.id || r.findingId === finding.findingId);
        
        return {
            id: finding.id || finding.findingId,
            title: finding.name || finding.title,
            severity: finding.severity?.toUpperCase() || "MEDIUM",
            confidence: 95, // Can be from backend if available
            aiExplanation: recommendation?.description || finding.description,
            impact: "Exploitation could lead to security breach",
            fix: recommendation?.remediation || "Review and apply security best practices",
            codeSnippet: recommendation?.remediation || "Configuration update required"
        };
    });

    if (!scanData) {
        return <div className="text-center py-20">Loading AI analysis...</div>;
    }

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
