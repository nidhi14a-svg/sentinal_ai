import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import {
    Mail, Mic, Cloud, Network, Cpu, Shield,
    Zap, Sparkles, Globe, GitBranch, Radar,
    TrendingUp, Eye, Lock, Award, ArrowRight
} from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import ParticleField from '../../components/background/ParticleField';
import GridBackground from '../../components/background/GridBackground';
import ScanlineOverlay from '../../components/background/ScanlineOverlay';

const FutureVision = () => {
    const controls = useAnimation();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.2 });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    const futureCards = [
        {
            id: 1,
            icon: Mail,
            title: 'Email Threat Detection',
            description: 'AI-powered analysis of inbound emails to detect phishing attempts, spoofed domains, and social engineering patterns in real time — flagging threats before employees click.',
            color: 'cyan',
            glow: 'shadow-cyan-500/50',
            badge: 'Q2 2025',
        },
        {
            id: 2,
            icon: Mic,
            title: 'Deepfake Voice Detection',
            description: 'Real-time audio analysis to identify AI-generated voice cloning during phone calls — protecting organizations from voice-based fraud and impersonation attacks.',
            color: 'purple',
            glow: 'shadow-purple-500/50',
            badge: 'Q3 2025',
        },
        {
            id: 3,
            icon: Cloud,
            title: 'Cloud Security Monitoring',
            description: 'Continuous monitoring of AWS, Azure, and GCP environments for misconfigurations, exposed storage buckets, and abnormal access patterns — extending Sentinel beyond websites.',
            color: 'red',
            glow: 'shadow-red-500/50',
            badge: 'Q4 2025',
        },
        {
            id: 4,
            icon: Network,
            title: 'Multi-Vector Attack Correlation',
            description: 'Sentinel\'s AI core connects signals across email, voice, cloud, and web vectors — identifying coordinated attack campaigns that no single tool could detect alone.',
            color: 'gradient',
            glow: 'shadow-purple-500/50',
            badge: '2026',
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.6, type: "spring", stiffness: 100 },
        },
    };

    const lineVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 1.5, ease: "easeInOut" },
        },
    };

    const nodeVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 200, delay: 1.5 },
        },
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Premium Background with enhanced particles for aspirational feel */}
            <div className="fixed inset-0 z-0">
                <ParticleField />
                <GridBackground />
                <ScanlineOverlay />
            </div>

            {/* Animated gradient orbs for cinematic feel */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-red/5 rounded-full blur-3xl animate-pulse delay-2000" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="text-center mb-16"
                >
                    {/* Animated badge */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-accent-purple/30 bg-accent-purple/10 backdrop-blur-sm"
                    >
                        <Zap className="w-4 h-4 text-accent-purple animate-pulse" />
                        <span className="text-xs font-mono text-accent-purple tracking-wider">ROADMAP 2025-2026</span>
                    </motion.div>

                    {/* Main Heading with animated gradient */}
                    <motion.h1
                        className="text-5xl md:text-7xl font-black mb-4"
                        animate={{
                            textShadow: [
                                "0 0 0px #9d4dff",
                                "0 0 20px #9d4dff",
                                "0 0 40px #00e5ff",
                                "0 0 20px #9d4dff",
                                "0 0 0px #9d4dff",
                            ],
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <span className="bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-red bg-clip-text text-transparent">
                            The Future of Sentinel AI
                        </span>
                    </motion.h1>

                    {/* Subtext */}
                    <p className="text-accent-cyan font-mono text-sm md:text-base mb-6">
                        Beyond single-site audits — a unified, multi-vector threat intelligence platform
                    </p>

                    {/* Animated Divider */}
                    <div className="flex justify-center">
                        <div className="w-64 md:w-96 h-px bg-gradient-to-r from-transparent via-accent-red to-transparent animate-pulse" />
                    </div>
                    <div className="flex justify-center mt-1">
                        <div className="w-48 md:w-64 h-px bg-gradient-to-r from-transparent via-accent-cyan to-transparent animate-pulse delay-300" />
                    </div>
                    <div className="flex justify-center mt-1">
                        <div className="w-32 md:w-48 h-px bg-gradient-to-r from-transparent via-accent-purple to-transparent animate-pulse delay-700" />
                    </div>
                </motion.div>

                {/* Future Cards Grid */}
                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={controls}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
                >
                    {futureCards.map((card, index) => (
                        <motion.div
                            key={card.id}
                            variants={cardVariants}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            className="relative group"
                        >
                            {/* Future ribbon badge */}
                            <div className="absolute -top-3 -right-3 z-20">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-cyan rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="relative px-3 py-1 rounded-full bg-gradient-to-r from-accent-purple to-accent-cyan text-[9px] font-mono font-bold text-white shadow-lg">
                                        {card.badge}
                                    </div>
                                </div>
                            </div>

                            <GlassCard
                                glowColor={card.color === 'cyan' ? 'cyan' : card.color === 'purple' ? 'purple' : 'red'}
                                className="h-full transition-all duration-500 overflow-hidden group-hover:shadow-2xl"
                            >
                                {/* Animated background gradient on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br from-${card.color === 'cyan' ? 'accent-cyan' : card.color === 'purple' ? 'accent-purple' : 'accent-red'}/0 to-${card.color === 'cyan' ? 'accent-cyan' : card.color === 'purple' ? 'accent-purple' : 'accent-red'}/0 group-hover:opacity-10 transition-opacity duration-500`} />

                                {/* Diagonal pattern overlay */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
                                    <div className="w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:20px_20px]" />
                                </div>

                                <div className="relative p-6">
                                    {/* Icon Container with glow */}
                                    <div className="relative mb-5">
                                        <div className={`absolute inset-0 bg-gradient-to-br from-${card.color === 'cyan' ? 'accent-cyan' : card.color === 'purple' ? 'accent-purple' : 'accent-red'}/30 to-${card.color === 'cyan' ? 'accent-cyan' : card.color === 'purple' ? 'accent-purple' : 'accent-red'}/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                        <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-bg-secondary to-bg-panel border-2 ${card.color === 'cyan' ? 'border-accent-cyan' : card.color === 'purple' ? 'border-accent-purple' : 'border-accent-red'} shadow-${card.color === 'cyan' ? 'cyan' : card.color === 'purple' ? 'purple' : 'red'} group-hover:shadow-${card.color === 'cyan' ? 'cyan' : card.color === 'purple' ? 'purple' : 'red'} transition-all duration-300`}>
                                            <card.icon className={`w-8 h-8 ${card.color === 'cyan' ? 'text-accent-cyan' : card.color === 'purple' ? 'text-accent-purple' : 'text-accent-red'} group-hover:scale-110 transition-transform duration-300`} />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className={`text-xl font-bold mb-3 ${card.color === 'cyan' ? 'text-accent-cyan' : card.color === 'purple' ? 'text-accent-purple' : 'text-accent-red'} font-mono`}>
                                        {card.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-text-secondary text-sm leading-relaxed">
                                        {card.description}
                                    </p>

                                    {/* Animated arrow on hover */}
                                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                        <ArrowRight className={`w-5 h-5 ${card.color === 'cyan' ? 'text-accent-cyan' : card.color === 'purple' ? 'text-accent-purple' : 'text-accent-red'}`} />
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Correlation Diagram */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="mb-16"
                >
                    <GlassCard glowColor="purple" className="p-8 overflow-hidden">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-text-primary mb-2">
                                Unified Threat Correlation
                            </h3>
                            <p className="text-text-dim text-sm font-mono">
                                All signals converge into one AI brain — total visibility across every attack surface
                            </p>
                        </div>

                        {/* SVG Diagram */}
                        <div className="relative w-full max-w-4xl mx-auto">
                            <svg viewBox="0 0 800 300" className="w-full h-auto">
                                <defs>
                                    <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.3" />
                                        <stop offset="50%" stopColor="#00e5ff" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#9d4dff" stopOpacity="0.3" />
                                    </linearGradient>
                                    <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#ff1a3c" stopOpacity="0.3" />
                                        <stop offset="50%" stopColor="#ff1a3c" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#9d4dff" stopOpacity="0.3" />
                                    </linearGradient>
                                    <linearGradient id="lineGrad3" x1="100%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#9d4dff" stopOpacity="0.3" />
                                        <stop offset="50%" stopColor="#9d4dff" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.3" />
                                    </linearGradient>
                                    <linearGradient id="lineGrad4" x1="0%" y1="100%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.3" />
                                        <stop offset="50%" stopColor="#ff1a3c" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.3" />
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>

                                {/* Connecting Lines */}
                                <motion.line
                                    x1="120"
                                    y1="80"
                                    x2="380"
                                    y2="140"
                                    stroke="url(#lineGrad1)"
                                    strokeWidth="2"
                                    strokeDasharray="6,6"
                                    variants={lineVariants}
                                    initial="hidden"
                                    animate={controls}
                                    filter="url(#glow)"
                                />
                                <motion.line
                                    x1="680"
                                    y1="80"
                                    x2="420"
                                    y2="140"
                                    stroke="url(#lineGrad2)"
                                    strokeWidth="2"
                                    strokeDasharray="6,6"
                                    variants={lineVariants}
                                    initial="hidden"
                                    animate={controls}
                                    filter="url(#glow)"
                                />
                                <motion.line
                                    x1="120"
                                    y1="220"
                                    x2="380"
                                    y2="160"
                                    stroke="url(#lineGrad3)"
                                    strokeWidth="2"
                                    strokeDasharray="6,6"
                                    variants={lineVariants}
                                    initial="hidden"
                                    animate={controls}
                                    filter="url(#glow)"
                                />
                                <motion.line
                                    x1="680"
                                    y1="220"
                                    x2="420"
                                    y2="160"
                                    stroke="url(#lineGrad4)"
                                    strokeWidth="2"
                                    strokeDasharray="6,6"
                                    variants={lineVariants}
                                    initial="hidden"
                                    animate={controls}
                                    filter="url(#glow)"
                                />

                                {/* Nodes */}
                                <motion.g variants={nodeVariants} initial="hidden" animate={controls}>
                                    {/* Email Node */}
                                    <circle cx="120" cy="80" r="30" fill="#0a0a12" stroke="#00e5ff" strokeWidth="2" filter="url(#glow)" />
                                    <Mail x="105" y="65" width="30" height="30" stroke="#00e5ff" />
                                    <text x="120" y="130" textAnchor="middle" fill="#00e5ff" fontSize="10" fontFamily="monospace">Email</text>

                                    {/* Voice Node */}
                                    <circle cx="680" cy="80" r="30" fill="#0a0a12" stroke="#ff1a3c" strokeWidth="2" filter="url(#glow)" />
                                    <Mic x="665" y="65" width="30" height="30" stroke="#ff1a3c" />
                                    <text x="680" y="130" textAnchor="middle" fill="#ff1a3c" fontSize="10" fontFamily="monospace">Voice</text>

                                    {/* Cloud Node */}
                                    <circle cx="120" cy="220" r="30" fill="#0a0a12" stroke="#9d4dff" strokeWidth="2" filter="url(#glow)" />
                                    <Cloud x="105" y="205" width="30" height="30" stroke="#9d4dff" />
                                    <text x="120" y="265" textAnchor="middle" fill="#9d4dff" fontSize="10" fontFamily="monospace">Cloud</text>

                                    {/* Web Node */}
                                    <circle cx="680" cy="220" r="30" fill="#0a0a12" stroke="#00e5ff" strokeWidth="2" filter="url(#glow)" />
                                    <Globe x="665" y="205" width="30" height="30" stroke="#00e5ff" />
                                    <text x="680" y="265" textAnchor="middle" fill="#00e5ff" fontSize="10" fontFamily="monospace">Web</text>

                                    {/* Central Core */}
                                    <motion.circle
                                        cx="400"
                                        cy="150"
                                        r="50"
                                        fill="url(#coreGrad)"
                                        stroke="#ff1a3c"
                                        strokeWidth="3"
                                        animate={{
                                            r: [48, 52, 48],
                                            strokeWidth: [3, 4, 3],
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        filter="url(#glow)"
                                    />
                                    <Cpu x="380" y="130" width="40" height="40" stroke="#ff1a3c" />
                                    <text x="400" y="215" textAnchor="middle" fill="#ff1a3c" fontSize="11" fontFamily="monospace" fontWeight="bold">Sentinel AI Core</text>
                                </motion.g>
                            </svg>

                            {/* Animated pulse rings around center */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <motion.div
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-32 h-32 rounded-full border-2 border-accent-red/50"
                                />
                                <motion.div
                                    animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                    className="w-32 h-32 rounded-full border border-accent-cyan/30"
                                />
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Footer Tagline */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 0.6 }}
                    className="text-center"
                >
                    <div className="inline-block mb-4">
                        <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-accent-purple/20 via-accent-cyan/20 to-accent-red/20 border border-accent-purple/30 backdrop-blur-sm">
                            <Shield className="w-5 h-5 text-accent-cyan" />
                            <span className="text-lg md:text-xl font-mono font-bold bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-red bg-clip-text text-transparent">
                                One AI. Every attack surface. Total visibility.
                            </span>
                            <Award className="w-5 h-5 text-accent-red" />
                        </div>
                    </div>

                    <p className="text-text-dim text-xs font-mono tracking-wider">
                        Sentinel AI — Roadmap Vision (not part of current build)
                    </p>

                    <div className="flex items-center justify-center gap-3 mt-4 text-[10px] font-mono text-text-dim/50">
                        <span>✓ Patent Pending</span>
                        <span className="w-1 h-1 rounded-full bg-accent-red" />
                        <span>✓ Research Collaboration with AI Labs</span>
                        <span className="w-1 h-1 rounded-full bg-accent-red" />
                        <span>✓ Enterprise Beta Available</span>
                    </div>
                </motion.div>

                {/* Floating particles for cinematic effect */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    {[...Array(30)].map((_, i) => {
                        const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
                        const vh = typeof window !== 'undefined' ? window.innerHeight : 720;
                        return (
                            <motion.div
                                key={i}
                                initial={{ x: Math.random() * vw, y: Math.random() * vh }}
                                animate={{
                                    y: [null, Math.random() * vh],
                                    x: [null, Math.random() * vw],
                                    opacity: [0, 0.3, 0],
                                }}
                                transition={{ duration: 8 + Math.random() * 5, repeat: Infinity, delay: i * 0.3 }}
                                className="absolute w-1 h-1 rounded-full"
                                style={{
                                    backgroundColor: i % 3 === 0 ? '#ff1a3c' : i % 3 === 1 ? '#00e5ff' : '#9d4dff',
                                    boxShadow: `0 0 5px ${i % 3 === 0 ? '#ff1a3c' : i % 3 === 1 ? '#00e5ff' : '#9d4dff'}`,
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FutureVision;