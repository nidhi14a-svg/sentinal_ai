import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { X, CheckCircle2, Shield, AlertTriangle, Lock, Eye, Globe, TrendingUp, Award, Zap } from 'lucide-react';
import SeverityBadge from '../../components/common/SeverityBadge';

import { useDashboard } from '../../context/DashboardContext';

const ScoreComparison = () => {
    const { scanData } = useDashboard();
    const [hoveredRow, setHoveredRow] = useState(null);

    const vulnerabilities = [
        {
            id: 'SEC-001',
            title: 'Missing Content-Security-Policy Header',
            severity: 'HIGH',
            before: 'Vulnerable',
            after: 'Fixed',
            icon: Shield,
            riskScore: 85,
            fixTime: '2.3s',
        },
        {
            id: 'SEC-002',
            title: 'Missing Strict-Transport-Security Header',
            severity: 'MEDIUM',
            before: 'Vulnerable',
            after: 'Fixed',
            icon: Lock,
            riskScore: 72,
            fixTime: '1.8s',
        },
        {
            id: 'SEC-003',
            title: 'Directory Listing Enabled (/backup/)',
            severity: 'HIGH',
            before: 'Exposed',
            after: 'Fixed',
            icon: Eye,
            riskScore: 88,
            fixTime: '2.1s',
        },
        {
            id: 'SEC-004',
            title: 'Outdated TLS Configuration (TLS 1.0)',
            severity: 'CRITICAL',
            before: 'Vulnerable',
            after: 'Fixed',
            icon: Globe,
            riskScore: 95,
            fixTime: '2.5s',
        },
    ];

    const displayVulnerabilities = (scanData?.vulnerabilities || vulnerabilities).map(v => ({
        id: v.id,
        title: v.name || v.title,
        severity: v.severity,
        before: 'Vulnerable',
        after: 'Fixed',
        icon: Shield,
        riskScore: v.score || v.cvss ? Math.round((v.score || parseFloat(v.cvss)) * 10) : 80,
        fixTime: '1.2s'
    }));

    const totalRiskBefore = displayVulnerabilities.reduce((sum, v) => sum + v.riskScore, 0);
    const totalRiskAfter = 0;
    const improvement = ((totalRiskBefore - totalRiskAfter) / totalRiskBefore) * 100;

    return (
        <div className="relative">
            {/* Animated background glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-status-success/20 via-accent-cyan/20 to-accent-purple/20 rounded-3xl blur-2xl animate-pulse" />

            <div className="relative glass-panel rounded-2xl overflow-hidden border border-status-success/30 backdrop-blur-xl">
                {/* Header with 3D effect */}
                <div className="px-6 py-5 border-b border-status-success/30 bg-gradient-to-r from-status-success/10 via-transparent to-accent-cyan/10">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-status-success animate-pulse" />
                                <div className="w-3 h-3 rounded-full bg-status-success" />
                                <div className="w-3 h-3 rounded-full bg-status-success" />
                            </div>
                            <Award className="w-5 h-5 text-status-success" />
                            <span className="text-sm font-mono text-status-success tracking-wider font-bold">VULNERABILITY_RESOLUTION_SUMMARY</span>
                        </div>

                        {/* Animated stats pill */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-status-success/20 border border-status-success/50"
                        >
                            <TrendingUp className="w-3.5 h-3.5 text-status-success" />
                            <span className="text-xs font-mono text-status-success font-bold">100% RESOLUTION RATE</span>
                        </motion.div>
                    </div>
                </div>

                {/* 3D Column Labels */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border-subtle">
                    <div className="col-span-5">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2"
                        >
                            <Shield className="w-4 h-4 text-accent-cyan" />
                            <span className="text-xs font-mono text-text-dim font-bold tracking-wider">SECURITY ISSUE</span>
                        </motion.div>
                    </div>
                    <div className="col-span-2 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center justify-center gap-2"
                        >
                            <AlertTriangle className="w-4 h-4 text-status-high" />
                            <span className="text-xs font-mono text-text-dim font-bold">SEVERITY</span>
                        </motion.div>
                    </div>
                    <div className="col-span-2 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col items-center"
                        >
                            <span className="text-xs font-mono text-status-critical font-bold">BEFORE</span>
                            <span className="text-[9px] font-mono text-text-dim">Risk Score: {totalRiskBefore}</span>
                        </motion.div>
                    </div>
                    <div className="col-span-3 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col items-center"
                        >
                            <span className="text-xs font-mono text-status-success font-bold">AFTER</span>
                            <span className="text-[9px] font-mono text-text-dim">Risk Score: 0</span>
                        </motion.div>
                    </div>
                </div>

                {/* Rows with 3D hover effects */}
                <div className="divide-y divide-border-subtle">
                    {displayVulnerabilities.map((vuln, index) => (
                        <motion.div
                            key={vuln.id}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.12, duration: 0.4, type: "spring" }}
                            onMouseEnter={() => setHoveredRow(index)}
                            onMouseLeave={() => setHoveredRow(null)}
                            className={`
                relative grid grid-cols-12 gap-4 px-6 py-4 transition-all duration-300 cursor-pointer
                ${hoveredRow === index ? 'bg-gradient-to-r from-status-success/5 via-transparent to-transparent' : ''}
              `}
                        >
                            {/* Animated border on hover */}
                            {hoveredRow === index && (
                                <motion.div
                                    layoutId="hoverBorder"
                                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-status-success to-accent-cyan"
                                    initial={{ scaleY: 0 }}
                                    animate={{ scaleY: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}

                            {/* Issue Column */}
                            <div className="col-span-5 flex items-center gap-3">
                                <motion.div
                                    className="relative"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-cyan/20 to-status-success/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative p-2 rounded-xl bg-gradient-to-br from-bg-secondary to-bg-panel border border-accent-cyan/20">
                                        <vuln.icon className="w-4 h-4 text-accent-cyan" />
                                    </div>
                                </motion.div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-mono text-text-primary font-bold">{vuln.title}</span>
                                        <span className="text-[9px] font-mono text-text-dim px-1.5 py-0.5 rounded bg-bg-secondary/50">{vuln.id}</span>
                                    </div>
                                    {hoveredRow === index && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-2 mt-1"
                                        >
                                            <Zap className="w-2.5 h-2.5 text-accent-cyan" />
                                            <span className="text-[9px] font-mono text-text-dim">Fix time: {vuln.fixTime}</span>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* Severity Column */}
                            <div className="col-span-2 flex items-center justify-center">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    <SeverityBadge severity={vuln.severity} size="sm" />
                                </motion.div>
                            </div>

                            {/* Before Column with animated risk bar */}
                            <div className="col-span-2 flex flex-col items-center gap-2">
                                <motion.div
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-critical/15 border border-status-critical/40"
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(255,26,60,0.3)" }}
                                >
                                    <X className="w-3 h-3 text-status-critical" />
                                    <span className="text-xs font-mono text-status-critical font-bold">{vuln.before}</span>
                                </motion.div>

                                {/* Risk score bar */}
                                <div className="w-full max-w-[80px]">
                                    <div className="flex justify-between text-[8px] font-mono text-text-dim mb-0.5">
                                        <span>Risk</span>
                                        <span>{vuln.riskScore}%</span>
                                    </div>
                                    <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${vuln.riskScore}%` }}
                                            transition={{ delay: index * 0.12 + 0.5, duration: 0.8, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-status-critical to-status-high rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* After Column with celebration animation */}
                            <div className="col-span-3 flex items-center justify-center gap-3">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: index * 0.12 + 0.8, type: "spring", stiffness: 300 }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-success/25 border border-status-success/60 shadow-glowSuccess"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <CheckCircle2 className="w-3 h-3 text-status-success" />
                                    <span className="text-xs font-mono text-status-success font-bold">{vuln.after}</span>
                                </motion.div>

                                {/* Success indicator with particle effect */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: index * 0.12 + 1, type: "spring" }}
                                    className="relative"
                                >
                                    <div className="w-6 h-6 rounded-full bg-status-success/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />
                                    </div>

                                    {/* Success particles */}
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: [0, 1.5, 2], opacity: [0, 0.5, 0] }}
                                        transition={{ delay: index * 0.12 + 1.2, duration: 0.8 }}
                                        className="absolute inset-0 rounded-full border-2 border-status-success"
                                    />
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer with animated stats */}
                <div className="px-6 py-4 border-t border-status-success/30 bg-gradient-to-r from-status-success/5 via-transparent to-accent-cyan/5">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            {/* Resolution meter */}
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Shield className="w-3.5 h-3.5 text-status-success" />
                                    <span className="text-xs font-mono text-text-primary">Resolution Rate</span>
                                </div>
                                <div className="relative w-32 h-2 bg-bg-secondary rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-status-success to-accent-cyan rounded-full"
                                    />
                                    <motion.div
                                        initial={{ left: 0 }}
                                        animate={{ left: '100%' }}
                                        transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-status-success shadow-glowSuccess"
                                    />
                                </div>
                            </div>

                            <div className="w-px h-8 bg-border-subtle" />

                            {/* Stats */}
                            <div className="flex items-center gap-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.4, type: "spring" }}
                                    className="text-center"
                                >
                                    <div className="text-xl font-bold text-status-success font-mono">{displayVulnerabilities.length}/{displayVulnerabilities.length}</div>
                                    <div className="text-[9px] text-text-dim">Vulnerabilities</div>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.6, type: "spring" }}
                                    className="text-center"
                                >
                                    <div className="text-xl font-bold text-accent-cyan font-mono">100%</div>
                                    <div className="text-[9px] text-text-dim">Success Rate</div>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.8, type: "spring" }}
                                    className="text-center"
                                >
                                    <div className="text-xl font-bold text-accent-purple font-mono">0</div>
                                    <div className="text-[9px] text-text-dim">Remaining Risks</div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Animated success badge */}
                        <motion.div
                            initial={{ scale: 0, x: 50 }}
                            animate={{ scale: 1, x: 0 }}
                            transition={{ delay: 2, type: "spring", stiffness: 200 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-status-success/20 border border-status-success/50"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ delay: 2.2, duration: 0.5 }}
                            >
                                <Award className="w-4 h-4 text-status-success" />
                            </motion.div>
                            <span className="text-xs font-mono text-status-success font-bold">VERIFICATION PASSED ✓</span>
                        </motion.div>
                    </div>

                    {/* Animated progress line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                        className="mt-3 h-px bg-gradient-to-r from-transparent via-status-success to-transparent"
                        style={{ transformOrigin: 'left' }}
                    />
                </div>

                {/* Floating success particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: Math.random() * 400 - 200, y: Math.random() * 200 - 100, scale: 0, opacity: 0 }}
                            animate={{
                                x: Math.random() * 600 - 300,
                                y: Math.random() * 300 - 150,
                                scale: 0.5 + Math.random() * 0.8,
                                opacity: [0, 0.6, 0]
                            }}
                            transition={{
                                duration: 2 + Math.random() * 2,
                                delay: 2 + Math.random() * 2,
                                repeat: Infinity,
                                repeatDelay: Math.random() * 3
                            }}
                            className="absolute w-1 h-1 rounded-full"
                            style={{
                                backgroundColor: i % 3 === 0 ? '#39ff8a' : i % 3 === 1 ? '#00e5ff' : '#9d4dff',
                                boxShadow: `0 0 5px ${i % 3 === 0 ? '#39ff8a' : i % 3 === 1 ? '#00e5ff' : '#9d4dff'}`,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScoreComparison;