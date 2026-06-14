import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Zap, ArrowRight, Search, Target, Globe, Link, Sliders, AlertTriangle, Info, Rocket, Check, ExternalLink, Shield, Brain, Wrench, FileCheck, ShieldCheck, X } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

const Landing = ({ onBegin }) => {
    const canvasRef = useRef(null);
    const {
        targetDomain, setTargetDomain,
        deploymentLink, setDeploymentLink,
        scanProfile, setScanProfile
    } = useDashboard();

    const [showForm, setShowForm] = useState(false);
    const [domain, setDomain] = useState('');
    const [link, setLink] = useState('');
    const [authorized, setAuthorized] = useState(false);
    const [domainError, setDomainError] = useState('');

    const validateDomain = (value) => {
        if (!value.trim()) {
            setDomainError('Domain is required');
            return false;
        }
        const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (domainRegex.test(value) || ipRegex.test(value)) {
            setDomainError('');
            return true;
        }
        setDomainError('Please enter a valid domain or IP address');
        return false;
    };

    const handleDomainChange = (e) => {
        const value = e.target.value;
        setDomain(value);
        validateDomain(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateDomain(domain)) {
            return;
        }
        if (!authorized) {
            return;
        }

        setTargetDomain(domain);
        setDeploymentLink(link);
        setShowForm(false);
        onBegin();
    };

    const isValid = domain.trim() && !domainError && authorized;


    const features = [
        { icon: ShieldCheck, title: 'Autonomous Detection', desc: 'AI-powered vulnerability scanning', color: 'red' },
        { icon: Brain, title: 'Claude AI Analysis', desc: 'Plain English explanations', color: 'cyan' },
        { icon: Wrench, title: 'Auto-Remediation', desc: 'Instant security fixes', color: 'purple' },
        { icon: FileCheck, title: 'Forensic Reports', desc: 'Before/after verification', color: 'red' },
    ];

    // ORIGINAL PURE RED CYBER BOOMING BACKGROUND
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let boomRings = [];
        let redEnergyParticles = [];
        let redDataStreams = [];
        let redPulseNodes = [];
        let animationId;
        let time = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initRedDataStreams();
            initRedPulseNodes();
        };

        class RedEnergyParticle {
            constructor(x, y, size, vx, vy, life) {
                this.x = x;
                this.y = y;
                this.size = size;
                this.vx = vx;
                this.vy = vy;
                this.life = life;
                this.maxLife = life;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life -= 0.02;
                return this.life > 0;
            }

            draw(ctx) {
                const glowSize = this.size * (1 + (1 - this.life / this.maxLife) * 2);
                ctx.shadowBlur = 12;
                ctx.shadowColor = '#ff1a3c';

                ctx.beginPath();
                ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowSize);
                gradient.addColorStop(0, '#ff1a3c');
                gradient.addColorStop(0.5, '#ff4d6d');
                gradient.addColorStop(1, 'rgba(255, 26, 60, 0)');
                ctx.fillStyle = gradient;
                ctx.fill();

                ctx.shadowBlur = 0;
            }
        }

        class RedBoomRing {
            constructor(x, y, maxRadius, delay = 0) {
                this.x = x;
                this.y = y;
                this.radius = 10;
                this.maxRadius = maxRadius;
                this.life = 1;
                this.speed = 5;
                this.delay = delay;
                this.hasStarted = delay === 0;
                this.delayTimer = 0;
            }

            update() {
                if (!this.hasStarted) {
                    this.delayTimer++;
                    if (this.delayTimer >= this.delay) {
                        this.hasStarted = true;
                    }
                    return true;
                }

                this.radius += this.speed;
                this.life -= 0.018;
                return this.life > 0;
            }

            draw(ctx) {
                if (!this.hasStarted) return;

                const opacity = this.life * 0.8;

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 26, 60, ${opacity})`;
                ctx.lineWidth = 3;
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#ff1a3c';
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 26, 60, ${opacity * 0.4})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.shadowBlur = 0;
            }
        }

        class RedDataStream {
            constructor(x, speed) {
                this.x = x;
                this.y = Math.random() * canvas.height;
                this.speed = speed;
                this.characters = ['0', '1', '>', '<', '#', '$', '%', '&', '*', '!', '?'];
                this.text = '';
                for (let i = 0; i < 30; i++) {
                    this.text += this.characters[Math.floor(Math.random() * this.characters.length)];
                }
            }

            update() {
                this.y += this.speed;
                if (this.y > canvas.height + 200) {
                    this.y = -200;
                    this.x = Math.random() * canvas.width;
                    this.text = '';
                    for (let i = 0; i < 30; i++) {
                        this.text += this.characters[Math.floor(Math.random() * this.characters.length)];
                    }
                }
            }

            draw(ctx) {
                ctx.font = '11px "JetBrains Mono", monospace';
                ctx.fillStyle = `rgba(255, 26, 60, 0.12)`;
                ctx.fillText(this.text, this.x, this.y);
            }
        }

        class RedPulseNode {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.radius = 2;
                this.pulse = 0;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.pulse += 0.05;

                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw(ctx) {
                const pulseRadius = this.radius + Math.sin(this.pulse) * 1.5;

                ctx.beginPath();
                ctx.arc(this.x, this.y, pulseRadius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 26, 60, 0.8)`;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(this.x, this.y, pulseRadius * 1.8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 26, 60, 0.2)`;
                ctx.fill();
            }
        }

        const initRedDataStreams = () => {
            const streamCount = 35;
            redDataStreams = [];
            for (let i = 0; i < streamCount; i++) {
                const x = Math.random() * canvas.width;
                const speed = Math.random() * 1.5 + 0.8;
                redDataStreams.push(new RedDataStream(x, speed));
            }
        };

        const initRedPulseNodes = () => {
            const nodeCount = 50;
            redPulseNodes = [];
            for (let i = 0; i < nodeCount; i++) {
                redPulseNodes.push(new RedPulseNode(Math.random() * canvas.width, Math.random() * canvas.height));
            }
        };

        const createRedBoom = () => {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            boomRings.push(new RedBoomRing(centerX, centerY, 500, 0));
            boomRings.push(new RedBoomRing(centerX, centerY, 450, 4));
            boomRings.push(new RedBoomRing(centerX, centerY, 400, 8));
            boomRings.push(new RedBoomRing(centerX, centerY, 550, 12));
            boomRings.push(new RedBoomRing(centerX, centerY, 350, 16));

            for (let i = 0; i < 120; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 8 + 3;
                const size = Math.random() * 5 + 2;
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed;
                redEnergyParticles.push(new RedEnergyParticle(centerX, centerY, size, vx, vy, 1));
            }
        };

        const drawRedConnections = () => {
            for (let i = 0; i < redPulseNodes.length; i++) {
                for (let j = i + 1; j < redPulseNodes.length; j++) {
                    const dx = redPulseNodes[i].x - redPulseNodes[j].x;
                    const dy = redPulseNodes[i].y - redPulseNodes[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        const opacity = (1 - distance / 120) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(redPulseNodes[i].x, redPulseNodes[i].y);
                        ctx.lineTo(redPulseNodes[j].x, redPulseNodes[j].y);
                        ctx.strokeStyle = `rgba(255, 26, 60, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time++;

            ctx.fillStyle = '#05050a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const gridSize = 50;
            ctx.strokeStyle = `rgba(255, 26, 60, ${0.08 + Math.sin(time * 0.003) * 0.03})`;
            ctx.lineWidth = 0.5;
            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            ctx.strokeStyle = 'rgba(255, 26, 60, 0.05)';
            for (let i = -canvas.height; i < canvas.width + canvas.height; i += 40) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i + canvas.height, canvas.height);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(i, canvas.height);
                ctx.lineTo(i + canvas.height, 0);
                ctx.stroke();
            }

            for (const node of redPulseNodes) {
                node.update();
                node.draw(ctx);
            }
            drawRedConnections();

            for (const stream of redDataStreams) {
                stream.update();
                stream.draw(ctx);
            }

            for (let i = boomRings.length - 1; i >= 0; i--) {
                const alive = boomRings[i].update();
                boomRings[i].draw(ctx);
                if (!alive) boomRings.splice(i, 1);
            }

            for (let i = redEnergyParticles.length - 1; i >= 0; i--) {
                const alive = redEnergyParticles[i].update();
                redEnergyParticles[i].draw(ctx);
                if (!alive) redEnergyParticles.splice(i, 1);
            }

            if (time % 210 === 0 && time > 0) {
                createRedBoom();
            }

            const centerGlow = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 50, canvas.width / 2, canvas.height / 2, 250);
            centerGlow.addColorStop(0, `rgba(255, 26, 60, ${0.1 + Math.sin(time * 0.015) * 0.05})`);
            centerGlow.addColorStop(1, 'rgba(255, 26, 60, 0)');
            ctx.fillStyle = centerGlow;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            animationId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();

        setTimeout(() => createRedBoom(), 300);
        setTimeout(() => createRedBoom(), 2000);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Canvas Background */}
            <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />
            <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />

            {/* MAIN CONTENT */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Hero Section */}
                <div className="flex-1 flex items-center justify-center px-4 py-16">
                    <div className="max-w-5xl mx-auto text-center w-full">
                        {/* Lock Icon */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                            className="flex justify-center mb-8"
                        >
                            <div className="relative">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-30px] border-2 border-accent-red/40 rounded-full"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-50px] border border-accent-red/30 rounded-full"
                                />
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-70px] border border-accent-red/20 rounded-full"
                                />
                                <motion.div
                                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.9, 0.4] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="absolute inset-[-20px] bg-accent-red/30 rounded-full blur-2xl"
                                />
                                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-accent-red/20 to-transparent border-4 border-accent-red/70 flex items-center justify-center backdrop-blur-sm shadow-glowRed">
                                    <Lock className="w-16 h-16 text-accent-red" strokeWidth={1.5} />
                                </div>
                            </div>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-7xl md:text-8xl lg:text-9xl font-black mb-4 tracking-tighter"
                        >
                            <span className="text-white drop-shadow-2xl">SENTINEL</span>
                            <span className="text-accent-red drop-shadow-[0_0_50px_rgba(255,26,60,0.8)]"> AI</span>
                        </motion.h1>

                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="w-32 h-px bg-gradient-to-r from-transparent via-accent-red to-transparent mx-auto mb-6"
                        />

                        {/* Subtitle */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mb-10"
                        >
                            {['DETECT', 'ANALYZE', 'REMEDIATE', 'VERIFY'].map((word, index) => (
                                <div key={word} className="flex items-center gap-3 md:gap-6">
                                    <span className="text-sm md:text-base font-mono font-bold text-gray-300 tracking-wider">
                                        {word}
                                    </span>
                                    {index < 3 && (
                                        <motion.span
                                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 0.8, repeat: Infinity, delay: index * 0.2 }}
                                            className="text-accent-red text-xl"
                                        >
                                            ●
                                        </motion.span>
                                    )}
                                </div>
                            ))}
                        </motion.div>

                        {/* BEGIN MISSION BUTTON */}
                        {!showForm && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="group relative px-10 py-4 rounded-xl bg-gradient-to-r from-accent-red to-red-700 text-white font-bold text-lg font-mono tracking-wider overflow-hidden shadow-glowRed hover:shadow-glowRedStrong transition-all duration-300 cursor-pointer"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <div className="relative flex items-center gap-3">
                                        <Zap className="w-5 h-5" />
                                        BEGIN MISSION
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                    </div>
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Features Section - RESTORED */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                    className="py-20 px-4 border-t border-accent-red/20 bg-gradient-to-t from-black/90 via-black/70 to-transparent"
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-block mb-4 px-4 py-1.5 rounded-full border border-accent-red/30 bg-black/50"
                            >
                                <span className="text-xs font-mono text-accent-red tracking-wider font-bold">WHY CHOOSE SENTINEL AI</span>
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-3xl md:text-4xl font-bold text-white mb-3"
                            >
                                Next-Generation{' '}
                                <span className="text-accent-red">Security</span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-gray-400 max-w-2xl mx-auto text-sm"
                            >
                                Enterprise-grade protection powered by cutting-edge AI
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -8 }}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-black/60 to-black/40 border border-accent-red/20 backdrop-blur-sm hover:border-accent-red/60 hover:shadow-glowRed transition-all duration-300">
                                        <div className="relative mb-4 inline-block">
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-red/15 to-accent-red/5 border border-accent-red/30 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                                                <feature.icon className="w-7 h-7 text-accent-red" />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2 font-mono">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {feature.desc}
                                        </p>
                                        <div className="w-12 h-px bg-gradient-to-r from-accent-red to-transparent mt-4 group-hover:w-20 transition-all duration-500" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20"
                    onClick={() => setShowForm(true)}
                >
                    <span className="text-[10px] font-mono text-gray-500 tracking-widest">SCROLL TO EXPLORE</span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-px h-10 bg-gradient-to-b from-accent-red to-transparent"
                    />
                </motion.div>
            </div>

            {/* FORM MODAL */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
                        onClick={() => setShowForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <form onSubmit={handleSubmit}>
                                <div className="glass-panel border-2 border-accent-red/50 shadow-glowRed bg-bg-primary/95 p-6 md:p-8">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-accent-red/20 transition-all duration-300 z-10"
                                    >
                                        <X className="w-5 h-5 text-text-dim hover:text-accent-red transition-colors" />
                                    </button>

                                    <div className="text-center mb-6">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 mb-3">
                                            <Target className="w-3 h-3 text-accent-cyan" />
                                            <span className="text-[10px] font-mono text-accent-cyan tracking-wider font-bold">MISSION CONFIGURATION</span>
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">Define Your Target</h2>
                                        <p className="text-text-secondary text-xs md:text-sm">Enter your deployment details to begin the security audit</p>
                                        <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-red to-transparent mx-auto mt-4" />
                                    </div>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="text-xs font-mono text-text-secondary tracking-wider block mb-2">DOMAIN / IP ADDRESS *</label>
                                            <input
                                                type="text"
                                                value={domain}
                                                onChange={handleDomainChange}
                                                placeholder="e.g. yourdomain.com or 192.168.1.1"
                                                className="w-full px-4 py-3 rounded-xl bg-bg-secondary/50 border border-accent-red/30 font-mono text-sm focus:outline-none focus:border-accent-red/60 focus:shadow-glowRed transition-all duration-300"
                                                autoFocus
                                            />
                                            {domainError && (
                                                <span className="text-status-critical text-[10px] font-mono flex items-center gap-1 mt-1">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    {domainError}
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-xs font-mono text-text-secondary tracking-wider block mb-2">LIVE DEPLOYMENT URL (OPTIONAL)</label>
                                            <input
                                                type="text"
                                                value={link}
                                                onChange={(e) => setLink(e.target.value)}
                                                placeholder="e.g. https://your-app.vercel.app"
                                                className="w-full px-4 py-3 rounded-xl bg-bg-secondary/50 border border-accent-red/30 font-mono text-sm focus:outline-none focus:border-accent-red/60 focus:shadow-glowRed transition-all duration-300"
                                            />
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {['Vercel', 'Netlify', 'Railway', 'Render', 'AWS'].map((platform) => (
                                                    <button
                                                        key={platform}
                                                        type="button"
                                                        onClick={() => {
                                                            const urls = {
                                                                Vercel: 'https://your-app.vercel.app',
                                                                Netlify: 'https://your-app.netlify.app',
                                                                Railway: 'https://your-app.railway.app',
                                                                Render: 'https://your-app.onrender.com',
                                                                AWS: 'https://your-app.aws.amazon.com'
                                                            };
                                                            setLink(urls[platform]);
                                                        }}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-secondary/50 border border-accent-red/30 text-text-dim text-[10px] font-mono hover:border-accent-red/60 hover:text-accent-red transition-all duration-300"
                                                    >
                                                        <ExternalLink className="w-2.5 h-2.5" />
                                                        {platform}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                          <label className="text-xs font-mono text-text-secondary tracking-wider block mb-2">SCAN TYPE</label>
                                          <div className="p-3 rounded-xl border border-accent-red/30 bg-accent-red/10">
                                            <div className="flex items-center gap-3">
                                              <Shield className="w-5 h-5 text-accent-cyan" />
                                              <div>
                                                <div className="text-sm font-bold font-mono text-text-primary">Full Security Audit</div>
                                                <div className="text-[10px] font-mono text-text-dim">Comprehensive vulnerability scan (2-3 minutes)</div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <div>
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={authorized}
                                                    onChange={(e) => setAuthorized(e.target.checked)}
                                                    className="mt-0.5 w-4 h-4 rounded border-accent-red/30 bg-bg-secondary/50 text-accent-red focus:ring-accent-red focus:ring-1"
                                                />
                                                <span className="text-xs text-text-primary font-mono">I confirm I have authorization to scan this target</span>
                                            </label>
                                            <div className="flex items-center gap-1 mt-2">
                                                <AlertTriangle className="w-3 h-3 text-status-high" />
                                                <span className="text-text-dim text-[9px] font-mono">Only scan websites you own or have explicit permission to test</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-accent-cyan/5 border border-accent-cyan/20">
                                            <Info className="w-3 h-3 text-accent-cyan" />
                                            <span className="text-[9px] font-mono text-text-dim">Demo mode: pre-authorized target is sample-domain.com</span>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <button
                                            type="submit"
                                            disabled={!isValid}
                                            className={`
                        w-full py-4 rounded-xl font-bold text-base md:text-lg font-mono tracking-wider transition-all duration-300
                        flex items-center justify-center gap-3
                        ${isValid
                                                    ? 'bg-gradient-to-r from-accent-red to-red-700 text-white shadow-glowRed hover:shadow-glowRedStrong cursor-pointer'
                                                    : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
                                                }
                      `}
                                        >
                                            <Rocket className="w-5 h-5" />
                                            LAUNCH SECURITY AUDIT
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                        {!isValid && (
                                            <p className="text-center text-[10px] text-text-dim mt-2 font-mono">
                                                Please enter a domain and confirm authorization
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Landing;