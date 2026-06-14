import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldOff, Eye, Lock, Shield, AlertTriangle, Skull, Zap, ArrowDown } from 'lucide-react';

const ThreatGraph = () => {
    const [linesDrawn, setLinesDrawn] = useState([]);

    const threatNodes = [
        // Left column (Causes)
        {
            id: 1,
            name: 'Missing CSP Header',
            severity: 'HIGH',
            icon: ShieldOff,
            x: 'left',
            y: 0,
            description: 'No Content Security Policy',
        },
        {
            id: 2,
            name: 'Directory Listing Enabled',
            severity: 'HIGH',
            icon: Eye,
            x: 'left',
            y: 1,
            description: 'Exposed directory structure',
        },
        {
            id: 3,
            name: 'Outdated TLS Config',
            severity: 'CRITICAL',
            icon: Lock,
            x: 'left',
            y: 2,
            description: 'TLS 1.0/1.1 enabled',
            pulse: true,
        },
        {
            id: 4,
            name: 'Missing HSTS Header',
            severity: 'MEDIUM',
            icon: Shield,
            x: 'left',
            y: 3,
            description: 'No HTTPS enforcement',
        },
        // Right column (Effects)
        {
            id: 5,
            name: 'Potential XSS Attack',
            severity: 'HIGH',
            icon: AlertTriangle,
            x: 'right',
            y: 0,
            description: 'Script injection possible',
        },
        {
            id: 6,
            name: 'Sensitive Data Exposure',
            severity: 'CRITICAL',
            icon: Eye,
            x: 'right',
            y: 1,
            description: 'Backup files accessible',
        },
        {
            id: 7,
            name: 'Man-in-the-Middle Risk',
            severity: 'CRITICAL',
            icon: Skull,
            x: 'right',
            y: 2,
            description: 'Connection interception',
        },
        {
            id: 8,
            name: 'Protocol Downgrade Attack',
            severity: 'HIGH',
            icon: Zap,
            x: 'right',
            y: 3,
            description: 'HTTP fallback possible',
        },
    ];

    const connections = [
        { from: 1, to: 5, label: 'enables' },
        { from: 2, to: 6, label: 'exposes' },
        { from: 3, to: 7, label: 'allows' },
        { from: 4, to: 8, label: 'permits' },
    ];

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'CRITICAL': return 'border-status-critical text-status-critical shadow-glowRed';
            case 'HIGH': return 'border-status-high text-status-high';
            case 'MEDIUM': return 'border-status-medium text-status-medium';
            default: return 'border-text-dim text-text-dim';
        }
    };

    const getSeverityBg = (severity) => {
        switch (severity) {
            case 'CRITICAL': return 'bg-status-critical/10';
            case 'HIGH': return 'bg-status-high/10';
            case 'MEDIUM': return 'bg-status-medium/10';
            default: return 'bg-text-dim/10';
        }
    };

    useEffect(() => {
        const timers = connections.map((_, idx) => {
            return setTimeout(() => {
                setLinesDrawn(prev => [...prev, idx]);
            }, 500 + idx * 300);
        });
        return () => timers.forEach(timer => clearTimeout(timer));
    }, []);

    const leftNodes = threatNodes.filter(node => node.x === 'left');
    const rightNodes = threatNodes.filter(node => node.x === 'right');

    return (
        <div className="relative min-h-[500px] p-6">
            <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" style={{ position: 'absolute', top: 0, left: 0 }}>
                    <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ff1a3c" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#ff1a3c" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#ff1a3c" stopOpacity="0.3" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {connections.map((conn, idx) => {
                        const fromNode = threatNodes.find(n => n.id === conn.from);
                        const toNode = threatNodes.find(n => n.id === conn.to);
                        const fromIndex = leftNodes.findIndex(n => n.id === conn.from);
                        const toIndex = rightNodes.findIndex(n => n.id === conn.to);

                        const startX = `${25}%`;
                        const startY = `${15 + (fromIndex * 18)}%`;
                        const endX = `${75}%`;
                        const endY = `${15 + (toIndex * 18)}%`;

                        return (
                            <g key={idx}>
                                <motion.line
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{
                                        pathLength: linesDrawn.includes(idx) ? 1 : 0,
                                        opacity: linesDrawn.includes(idx) ? 1 : 0
                                    }}
                                    transition={{ duration: 1, delay: idx * 0.3 }}
                                    x1={startX}
                                    y1={startY}
                                    x2={endX}
                                    y2={endY}
                                    stroke="url(#lineGradient)"
                                    strokeWidth="2"
                                    strokeDasharray="5,5"
                                    strokeLinecap="round"
                                    filter="url(#glow)"
                                />
                                <motion.circle
                                    initial={{ scale: 0 }}
                                    animate={{ scale: linesDrawn.includes(idx) ? 1 : 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.3 + 0.8 }}
                                    cx={startX}
                                    cy={startY}
                                    r="4"
                                    fill="#ff1a3c"
                                />
                                <motion.circle
                                    initial={{ scale: 0 }}
                                    animate={{ scale: linesDrawn.includes(idx) ? 1 : 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.3 + 0.8 }}
                                    cx={endX}
                                    cy={endY}
                                    r="4"
                                    fill="#ff1a3c"
                                />
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Nodes Container */}
            <div className="relative grid grid-cols-2 gap-8">
                {/* Left Column - Causes */}
                <div className="space-y-4">
                    {leftNodes.map((node, idx) => (
                        <motion.div
                            key={node.id}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.15, duration: 0.5, type: "spring" }}
                            whileHover={{ scale: 1.02, x: 5 }}
                            className={`
                relative p-4 rounded-xl border-2 glass-panel cursor-pointer
                ${getSeverityColor(node.severity)} ${getSeverityBg(node.severity)}
                ${node.pulse ? 'animate-pulseGlow' : ''}
              `}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-bg-secondary/50 ${getSeverityColor(node.severity)}`}>
                                    <node.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-mono font-bold text-sm">{node.name}</div>
                                    <div className="text-text-dim text-xs">{node.description}</div>
                                </div>
                                <div className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${getSeverityBg(node.severity)} ${getSeverityColor(node.severity)}`}>
                                    {node.severity}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Right Column - Effects */}
                <div className="space-y-4">
                    {rightNodes.map((node, idx) => (
                        <motion.div
                            key={node.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.15 + 0.2, duration: 0.5, type: "spring" }}
                            whileHover={{ scale: 1.02, x: -5 }}
                            className={`
                relative p-4 rounded-xl border-2 glass-panel cursor-pointer
                ${getSeverityColor(node.severity)} ${getSeverityBg(node.severity)}
              `}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-bg-secondary/50 ${getSeverityColor(node.severity)}`}>
                                    <node.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-mono font-bold text-sm">{node.name}</div>
                                    <div className="text-text-dim text-xs">{node.description}</div>
                                </div>
                                <div className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${getSeverityBg(node.severity)} ${getSeverityColor(node.severity)}`}>
                                    {node.severity}
                                </div>
                            </div>
                            {/* Animated arrow indicator */}
                            <motion.div
                                animate={{ x: [-5, 5, -5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -left-6 top-1/2 -translate-y-1/2"
                            >
                                <ArrowDown className="w-4 h-4 text-accent-red opacity-50" />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-2 right-4 flex gap-3 text-[10px] font-mono text-text-dim">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-px bg-accent-red" />
                    <span>Threat Cascade</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-status-critical animate-pulse" />
                    <span>Critical Risk</span>
                </div>
            </div>
        </div>
    );
};

export default ThreatGraph;