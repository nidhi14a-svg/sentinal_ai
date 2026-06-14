import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text3D, OrbitControls, Sparkles as ThreeSparkles, Float, Torus, MeshDistortMaterial, Sphere } from '@react-three/drei';
import {
    ShieldCheck, TrendingUp, ArrowRight, Award,
    Sparkles, CheckCircle2, Trophy, Star,
    PartyPopper, Zap, Target, BarChart3
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import ScoreComparison from './ScoreComparison';
import GlowButton from '../../components/common/GlowButton';
import GlassCard from '../../components/common/GlassCard';
import AnimatedCounter from '../../components/common/AnimatedCounter';

// 3D Rotating Shield Component
const RotatingShield = ({ progress }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
            meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh ref={meshRef} position={[0, 0, 0]}>
                <torusGeometry args={[1.2, 0.08, 64, 200]} />
                <MeshDistortMaterial color="#ff1a3c" emissive="#ff1a3c" emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.8, 32, 32]} />
                <MeshDistortMaterial color="#39ff8a" emissive="#39ff8a" emissiveIntensity={progress > 0 ? 0.8 : 0.2} metalness={0.9} roughness={0.1} distort={0.4} speed={2} />
            </mesh>
        </Float>
    );
};

// 3D Score Ring Component
const ScoreRing3D = ({ score, color, label, delay = 0 }) => {
    const ringRef = useRef();
    const [animatedScore, setAnimatedScore] = useState(0);

    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.z = state.clock.getElapsedTime() * 0.2;
            ringRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
        }
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                setAnimatedScore(prev => {
                    if (prev < score) return Math.min(prev + 2, score);
                    clearInterval(interval);
                    return prev;
                });
            }, 30);
        }, delay);
        return () => clearTimeout(timer);
    }, [score, delay]);

    const circumference = 2 * Math.PI * 1.5;
    const offset = circumference * (1 - animatedScore / 100);

    return (
        <group>
            <mesh ref={ringRef}>
                <torusGeometry args={[1.8, 0.06, 64, 200]} />
                <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0, 0.1]}>
                <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
                <MeshDistortMaterial color="#0a0a12" metalness={0.8} roughness={0.3} />
            </mesh>
            <Text3D
                font="/fonts/helvetiker_regular.typeface.json"
                size={0.8}
                height={0.1}
                position={[-0.6, -0.3, 0.2]}
            >
                {animatedScore}
                <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={0.5} />
            </Text3D>
        </group>
    );
};

// 3D Particle Field Component
const ParticleField3D = () => {
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial color="#39ff8a" size={0.05} transparent opacity={0.6} />
        </points>
    );
};

// Main Verification Component
const Verification = ({ onProceed }) => {
    const { verificationData, setReportData, targetDomain } = useDashboard();
    const [afterScoreAnimated, setAfterScoreAnimated] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [show3D, setShow3D] = useState(true);

    const beforeScore = verificationData?.before?.score || 58;
    const afterScore = verificationData?.after?.score || 94;
    const improvement = afterScore - beforeScore;

    useEffect(() => {
        const timer = setTimeout(() => {
            setAfterScoreAnimated(true);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 4000);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleGenerateReport = () => {
        const report = {
            timestamp: new Date().toISOString(),
            beforeScore,
            afterScore,
            improvement,
            vulnerabilitiesResolved: 4,
            totalFixed: 4,
            scanDuration: '14.2s',
            remediationDuration: '15.3s',
            verifiedAt: new Date().toLocaleTimeString(),
        };
        setReportData(report);
        onProceed?.();
    };

    // Confetti particles
    const confettiColors = ['#39ff8a', '#00e5ff', '#ff1a3c', '#9d4dff', '#ffb84d'];

    return (
        <div className="relative min-h-[calc(100vh-200px)] overflow-hidden">
            {/* 3D Background Canvas */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff1a3c" />
                    <ParticleField3D />
                    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
                        <RotatingShield progress={afterScoreAnimated ? 1 : 0} />
                    </Float>
                    <ThreeSparkles count={200} scale={[20, 20, 20]} size={0.1} color="#39ff8a" />
                </Canvas>
            </div>

            {/* Confetti Effect */}
            <AnimatePresence>
                {showConfetti && (
                    <div className="fixed inset-0 pointer-events-none z-50">
                        {[...Array(150)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    x: Math.random() * window.innerWidth,
                                    y: -20,
                                    scale: 0,
                                    rotate: 0
                                }}
                                animate={{
                                    y: window.innerHeight + 100,
                                    rotate: 360 * (Math.random() * 3 + 1),
                                    scale: 0.5 + Math.random() * 0.8
                                }}
                                transition={{
                                    duration: 1 + Math.random() * 2.5,
                                    delay: Math.random() * 0.8,
                                    ease: "easeOut"
                                }}
                                className="absolute"
                                style={{
                                    width: 4 + Math.random() * 8,
                                    height: 4 + Math.random() * 8,
                                    backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                                    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                                    boxShadow: `0 0 10px ${confettiColors[Math.floor(Math.random() * confettiColors.length)]}`,
                                }}
                            />
                        ))}
                    </div>
                )}
            </AnimatePresence>

            <div className="relative z-10">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 text-center"
                >
                    <div className="inline-flex items-center gap-3 mb-3 px-4 py-2 rounded-full border border-status-success/30 bg-status-success/10 backdrop-blur-sm">
                        <Award className="w-4 h-4 text-status-success" />
                        <span className="text-xs font-mono text-status-success tracking-wider">VERIFICATION_COMPLETE</span>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                            <div className="w-1.5 h-1.5 rounded-full bg-status-success" />
                            <div className="w-1.5 h-1.5 rounded-full bg-status-success" />
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-3">
                        <span className="bg-gradient-to-r from-text-primary via-status-success to-accent-cyan bg-clip-text text-transparent">
                            Verification Complete
                        </span>
                    </h1>

                    <p className="text-accent-cyan font-mono text-sm flex items-center justify-center gap-2">
                        <Target className="w-4 h-4 animate-pulse" />
                        Re-scan completed — All fixes verified for {targetDomain || 'sample-domain.com'}
                    </p>
                </motion.div>

                {/* Hero Score Section with 3D Integration */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="mb-10"
                >
                    <GlassCard
                        glowColor="success"
                        className="text-center py-10 px-6 relative overflow-hidden animate-pulseGlow border-status-success/50"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-status-success/5 via-transparent to-status-success/5" />

                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-8">
                                {/* Before Ring */}
                                <motion.div
                                    className="text-center"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="text-xs font-mono text-text-dim tracking-wider mb-3">BEFORE</div>
                                    <div className="relative w-36 h-36 md:w-48 md:h-48">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <defs>
                                                <linearGradient id="beforeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#ff1a3c" />
                                                    <stop offset="100%" stopColor="#ff6b35" />
                                                </linearGradient>
                                            </defs>
                                            <circle
                                                cx="50%"
                                                cy="50%"
                                                r="45%"
                                                fill="none"
                                                stroke="rgba(255,255,255,0.1)"
                                                strokeWidth="10"
                                            />
                                            <motion.circle
                                                cx="50%"
                                                cy="50%"
                                                r="45%"
                                                fill="none"
                                                stroke="url(#beforeGradient)"
                                                strokeWidth="10"
                                                strokeLinecap="round"
                                                initial={{ strokeDasharray: `${2 * Math.PI * 45}px`, strokeDashoffset: `${2 * Math.PI * 45}px` }}
                                                animate={{ strokeDashoffset: `${2 * Math.PI * 45 * (1 - beforeScore / 100)}px` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div className="text-3xl md:text-5xl font-black text-status-critical font-mono">{beforeScore}</div>
                                            <div className="text-[10px] text-text-dim mt-1">/100</div>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-xs font-mono text-status-critical">Critical Risk</div>
                                </motion.div>

                                {/* Animated Arrow */}
                                <motion.div
                                    initial={{ scale: 0, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                                    className="flex items-center justify-center"
                                >
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-accent-red to-status-success flex items-center justify-center shadow-glowRed animate-pulse">
                                        <ArrowRight className="w-7 h-7 text-white" />
                                    </div>
                                </motion.div>

                                {/* After Ring */}
                                <motion.div
                                    className="text-center"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="text-xs font-mono text-accent-cyan tracking-wider mb-3">AFTER</div>
                                    <div className="relative w-36 h-36 md:w-48 md:h-48">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <defs>
                                                <linearGradient id="afterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#39ff8a" />
                                                    <stop offset="100%" stopColor="#00e5ff" />
                                                </linearGradient>
                                            </defs>
                                            <circle
                                                cx="50%"
                                                cy="50%"
                                                r="45%"
                                                fill="none"
                                                stroke="rgba(255,255,255,0.1)"
                                                strokeWidth="10"
                                            />
                                            <motion.circle
                                                cx="50%"
                                                cy="50%"
                                                r="45%"
                                                fill="none"
                                                stroke="url(#afterGradient)"
                                                strokeWidth="10"
                                                strokeLinecap="round"
                                                initial={{ strokeDasharray: `${2 * Math.PI * 45}px`, strokeDashoffset: `${2 * Math.PI * 45}px` }}
                                                animate={{ strokeDashoffset: afterScoreAnimated ? `${2 * Math.PI * 45 * (1 - afterScore / 100)}px` : `${2 * Math.PI * 45}px` }}
                                                transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                                            />
                                            <motion.circle
                                                cx="50%"
                                                cy="50%"
                                                r="47%"
                                                fill="none"
                                                stroke="#39ff8a"
                                                strokeWidth="2"
                                                strokeDasharray="4 8"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: afterScoreAnimated ? 1 : 0 }}
                                                transition={{ delay: 2.3 }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <AnimatedCounter
                                                target={afterScore}
                                                duration={1500}
                                                delay={800}
                                                className="text-3xl md:text-5xl font-black text-status-success font-mono"
                                                startOnMount={false}
                                            />
                                            <div className="text-[10px] text-text-dim mt-1">/100</div>
                                        </div>
                                        {afterScoreAnimated && (
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
                                                transition={{ duration: 0.8, delay: 2.3 }}
                                                className="absolute inset-0 rounded-full border-4 border-status-success"
                                            />
                                        )}
                                    </div>
                                    <div className="mt-3 text-xs font-mono text-status-success">Hardened</div>
                                </motion.div>
                            </div>

                            {/* Improvement Banner */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0, y: 50 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                transition={{ delay: 2.2, type: "spring", stiffness: 300, bounce: 0.5 }}
                                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-status-success/20 border border-status-success/50 shadow-glowSuccess"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 15, -15, 0] }}
                                    transition={{ delay: 2.5, duration: 0.5 }}
                                >
                                    <TrendingUp className="w-5 h-5 text-status-success" />
                                </motion.div>
                                <motion.span
                                    className="text-2xl font-bold text-status-success font-mono"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ delay: 2.8, duration: 0.3 }}
                                >
                                    +{improvement} points
                                </motion.span>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ delay: 3, duration: 0.5 }}
                                >
                                    <Sparkles className="w-4 h-4 text-status-success animate-pulse" />
                                </motion.div>
                            </motion.div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Victory Banner with 3D Text Effect */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5, duration: 0.5 }}
                    className="mb-8"
                >
                    <GlassCard glowColor="success" className="text-center py-8 px-6 border-status-success/50">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ delay: 3, duration: 0.5 }}
                            >
                                <Trophy className="w-8 h-8 text-status-success" />
                            </motion.div>
                            <motion.h2
                                className="text-2xl md:text-3xl font-bold text-status-success"
                                animate={{ textShadow: ["0 0 0px #39ff8a", "0 0 20px #39ff8a", "0 0 0px #39ff8a"] }}
                                transition={{ delay: 3.2, duration: 1, repeat: 2 }}
                            >
                                System Hardened Successfully
                            </motion.h2>
                            <motion.div
                                animate={{ rotate: [0, -10, 10, 0] }}
                                transition={{ delay: 3, duration: 0.5 }}
                            >
                                <PartyPopper className="w-8 h-8 text-status-success" />
                            </motion.div>
                        </div>

                        <p className="text-text-secondary mb-4">
                            All critical vulnerabilities resolved and verified — {targetDomain || 'sample-domain.com'} is now production-ready
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
                            <motion.div
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-status-success/10 border border-status-success/30"
                                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(57,255,138,0.3)" }}
                            >
                                <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
                                <span className="text-status-success">Verification scan completed at {new Date().toLocaleTimeString()}</span>
                            </motion.div>
                            <motion.div
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30"
                                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,229,255,0.3)" }}
                            >
                                <Zap className="w-3.5 h-3.5 text-accent-cyan" />
                                <span className="text-accent-cyan">+94% security improvement</span>
                            </motion.div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Score Comparison Table with 3D Hover */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.8, duration: 0.5 }}
                    className="mb-8"
                >
                    <ScoreComparison />
                </motion.div>

                {/* Achievement Badges with 3D Flip Effect */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.1, duration: 0.5 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { icon: ShieldCheck, label: 'Security Score', value: 'A+', color: 'success', glow: '#39ff8a' },
                        { icon: Zap, label: 'Response Time', value: '14.2s', color: 'cyan', glow: '#00e5ff' },
                        { icon: BarChart3, label: 'Improvement', value: '+62%', color: 'purple', glow: '#9d4dff' },
                        { icon: Star, label: 'Compliance', value: 'PCI DSS', color: 'red', glow: '#ff1a3c' },
                    ].map((badge, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ scale: 0, rotateY: 180 }}
                            animate={{ scale: 1, rotateY: 0 }}
                            transition={{ delay: 3.2 + idx * 0.1, type: "spring", stiffness: 200 }}
                            whileHover={{ scale: 1.05, rotateY: 5, boxShadow: `0 0 30px ${badge.glow}` }}
                            className="glass-panel p-4 text-center rounded-xl border border-accent-cyan/20 cursor-pointer"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ delay: 3.5 + idx * 0.1, duration: 0.3 }}
                            >
                                <badge.icon className={`w-6 h-6 mx-auto mb-2 text-${badge.color === 'success' ? 'status-success' : badge.color === 'cyan' ? 'accent-cyan' : badge.color === 'purple' ? 'accent-purple' : 'accent-red'}`} />
                            </motion.div>
                            <div className={`text-xl font-bold text-${badge.color === 'success' ? 'status-success' : badge.color === 'cyan' ? 'accent-cyan' : badge.color === 'purple' ? 'accent-purple' : 'accent-red'} font-mono`}>
                                {badge.value}
                            </div>
                            <div className="text-[10px] text-text-dim mt-1">{badge.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Button with 3D Pulse */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.5, duration: 0.5 }}
                    className="flex justify-center pb-8"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                            boxShadow: ["0 0 0px #ff1a3c", "0 0 30px #ff1a3c", "0 0 0px #ff1a3c"],
                        }}
                        transition={{ delay: 3.8, duration: 1.5, repeat: 2 }}
                    >
                        <GlowButton
                            onClick={handleGenerateReport}
                            variant="primary"
                            icon={<ShieldCheck className="w-4 h-4" />}
                            className="px-8 py-3 text-base group"
                        >
                            GENERATE FORENSIC REPORT
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </GlowButton>
                    </motion.div>
                </motion.div>

                {/* 3D Success Message Floating */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4 }}
                    className="fixed bottom-4 left-4 z-20"
                >
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-status-success/10 backdrop-blur-sm border border-status-success/30">
                        <div className="w-2 h-2 rounded-full bg-status-success animate-ping" />
                        <span className="text-[10px] font-mono text-status-success">SECURE • VERIFIED • TRUSTED</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Verification;
