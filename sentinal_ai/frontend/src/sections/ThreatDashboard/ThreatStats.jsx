import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldAlert, CheckCircle2, TrendingUp, Shield } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import { useDashboard } from '../../context/DashboardContext';
import AnimatedCounter from '../../components/common/AnimatedCounter';

const ThreatStats = ({ resolvedCount = 0 }) => {
    const { scanData } = useDashboard();
    const findings = scanData?.findings || [];
    const activeVulns = findings.length;
    const criticalCount = findings.filter(f => f.severity === 'CRITICAL').length;
    
    const deduction = findings.reduce((acc, f) => {
        if (f.severity === 'CRITICAL') return acc + 15;
        if (f.severity === 'HIGH') return acc + 10;
        if (f.severity === 'MEDIUM') return acc + 5;
        return acc + 2;
    }, 0);
    const securityScore = Math.max(0, 100 - deduction);
    const scoreColor = securityScore < 50 ? '#ff1a3c' : securityScore < 75 ? '#ff6b35' : '#39ff8a';
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference * (1 - securityScore / 100);

    const stats = [
        {
            id: 1,
            value: activeVulns,
            label: 'Active Vulnerabilities',
            icon: AlertTriangle,
            color: 'status-high',
            glow: 'shadow-orange-500/30',
            suffix: '',
        },
        {
            id: 2,
            value: criticalCount,
            label: 'Critical Issues',
            icon: ShieldAlert,
            color: 'status-critical',
            glow: 'shadow-red-500/30',
            suffix: '',
            pulseBorder: true,
        },
        {
            id: 3,
            value: resolvedCount,
            label: 'Issues Fixed',
            icon: CheckCircle2,
            color: 'status-success',
            glow: 'shadow-green-500/30',
            suffix: '',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Security Score Card - Special Design with Circular Progress */}
            <GlassCard glowColor="red" className="relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-red/5 rounded-full blur-2xl group-hover:bg-accent-red/10 transition-all duration-500" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-accent-red" />
                        <span className="text-xs font-mono text-accent-red tracking-wider">SECURITY_SCORE</span>
                    </div>

                    <div className="flex items-center justify-center mb-3">
                        <div className="relative w-32 h-32">
                            {/* Background circle */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="40"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="6"
                                />
                                {/* Progress circle */}
                                <motion.circle
                                    initial={{ strokeDashoffset: circumference }}
                                    animate={{ strokeDashoffset: strokeDashoffset }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    cx="64"
                                    cy="64"
                                    r="40"
                                    fill="none"
                                    stroke={scoreColor}
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    style={{ strokeDashoffset: circumference }}
                                />
                            </svg>

                            {/* Center number */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <AnimatedCounter
                                    target={securityScore}
                                    duration={1500}
                                    suffix=""
                                    className="text-3xl font-black text-text-primary"
                                />
                                <span className="text-[10px] font-mono text-text-dim">/100</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-sm font-bold text-text-primary mb-1">Overall Risk Rating</div>
                        <div className="text-xs font-mono text-text-dim">HIGH_RISK</div>
                    </div>
                </div>
            </GlassCard>

            {/* Regular Stat Cards */}
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index + 1), duration: 0.5 }}
                >
                    <GlassCard
                        glowColor={stat.id === 2 ? 'red' : stat.id === 1 ? 'cyan' : 'purple'}
                        className={`relative overflow-hidden group ${stat.pulseBorder ? 'animate-pulseGlow' : ''}`}
                    >
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-2 rounded-lg bg-${stat.color}/10 border border-${stat.color}/30 group-hover:${stat.glow} transition-all duration-300`}>
                                    <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                                </div>
                                {stat.id === 2 && (
                                    <div className="px-2 py-0.5 rounded-full bg-status-critical/20 border border-status-critical/30">
                                        <span className="text-[10px] font-mono text-status-critical animate-pulse">URGENT</span>
                                    </div>
                                )}
                            </div>

                            <div className="mb-2">
                                <AnimatedCounter
                                    target={stat.value}
                                    duration={1200}
                                    suffix={stat.suffix}
                                    className="text-4xl md:text-5xl font-black text-text-primary font-mono"
                                />
                            </div>

                            <div className="text-text-secondary text-xs font-mono uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </div>

                        {/* Animated border glow */}
                        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${stat.glow}`} />
                    </GlassCard>
                </motion.div>
            ))}
        </div>
    );
};

export default ThreatStats;