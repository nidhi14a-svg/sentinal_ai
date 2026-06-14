import React from 'react';
import { motion } from 'framer-motion';
import {
    Network,
    Lock,
    ShieldAlert,
    FileSearch,
    Skull,
    CheckCircle2,
    Loader2,
    Timer
} from 'lucide-react';

const ScanChecklist = ({ activeStep, completedSteps, stepTimings }) => {
    const steps = [
        {
            id: 0,
            title: 'DNS RECONNAISSANCE',
            subtitle: 'Mapping domain infrastructure & nameservers',
            icon: Network,
            status: 'dns',
            gradient: 'from-cyan-500 to-blue-600',
        },
        {
            id: 1,
            title: 'SSL/TLS INSPECTION',
            subtitle: 'Analyzing certificate chain & cipher suites',
            icon: Lock,
            status: 'ssl',
            gradient: 'from-purple-500 to-pink-600',
        },
        {
            id: 2,
            title: 'HEADER ANALYSIS',
            subtitle: 'Scanning HTTP security headers configuration',
            icon: ShieldAlert,
            status: 'header',
            gradient: 'from-orange-500 to-red-600',
        },
        {
            id: 3,
            title: 'EXPOSURE DETECTION',
            subtitle: 'Checking exposed files & directory listings',
            icon: FileSearch,
            status: 'exposure',
            gradient: 'from-yellow-500 to-red-500',
        },
        {
            id: 4,
            title: 'RISK CLASSIFICATION',
            subtitle: 'Calculating CVSS scores & severity levels',
            icon: Skull,
            status: 'risk',
            gradient: 'from-red-600 to-red-900',
        },
    ];

    return (
        <div className="relative">
            {/* Premium background glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-accent-red/20 via-accent-cyan/20 to-accent-purple/20 rounded-3xl blur-2xl animate-pulse" />

            <div className="relative glass-panel rounded-2xl overflow-hidden border border-accent-red/30 backdrop-blur-xl">
                {/* Animated header bar */}
                <div className="px-6 py-4 border-b border-accent-red/20 bg-gradient-to-r from-accent-red/5 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-status-critical animate-pulse" />
                            <div className="w-3 h-3 rounded-full bg-status-high" />
                            <div className="w-3 h-3 rounded-full bg-status-low" />
                        </div>
                        <span className="text-xs font-mono text-accent-red tracking-wider">SCAN_SEQUENCE_ACTIVE</span>
                        <div className="flex-1" />
                        <span className="text-xs font-mono text-text-dim">v2.4.1</span>
                    </div>
                </div>

                {/* Checklist items */}
                <div className="p-6 space-y-4">
                    {steps.map((step, index) => {
                        const isActive = activeStep === step.id;
                        const isCompleted = completedSteps.includes(step.id);
                        const timing = stepTimings[step.id];
                        const IconComponent = step.icon;

                        return (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, x: -40, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 200 }}
                                className={`
                  relative group cursor-pointer
                  rounded-xl transition-all duration-500 overflow-hidden
                  ${isActive ? 'shadow-glowRed' : 'hover:shadow-glowRed/30'}
                `}
                            >
                                {/* Active step background glow */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent-red/15 via-transparent to-transparent animate-pulse" />
                                )}

                                {/* Border gradient on hover */}
                                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent-red/40 via-accent-cyan/20 to-transparent rounded-xl" />
                                </div>

                                <div className="relative flex items-center gap-5 p-4">
                                    {/* Premium Icon Container */}
                                    <div className="relative flex-shrink-0">
                                        {/* Multi-layer glow effect */}
                                        <div className={`
                      absolute inset-0 rounded-2xl blur-xl transition-all duration-500
                      ${isActive ? `bg-gradient-to-r ${step.gradient} opacity-100` : 'opacity-0 group-hover:opacity-60'}
                    `} />

                                        {/* Icon background with glassmorphism */}
                                        <div className={`
                      relative w-14 h-14 rounded-2xl flex items-center justify-center
                      bg-gradient-to-br from-bg-secondary/90 to-bg-panel/90 backdrop-blur-sm
                      border-2 transition-all duration-500
                      ${isActive
                                                ? `border-accent-red shadow-glowRed`
                                                : `border-border-subtle group-hover:border-accent-red/50 group-hover:shadow-glowRed/30`
                                            }
                      ${isCompleted ? 'border-status-success shadow-glowSuccess' : ''}
                    `}>
                                            {isCompleted ? (
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    <CheckCircle2 className="w-7 h-7 text-status-success" strokeWidth={2.5} />
                                                </motion.div>
                                            ) : isActive ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                >
                                                    <Loader2 className="w-7 h-7 text-accent-cyan" strokeWidth={2.5} />
                                                </motion.div>
                                            ) : (
                                                <IconComponent className={`w-7 h-7 transition-all duration-300 ${isActive ? 'text-accent-red' : 'text-text-dim group-hover:text-accent-red'}`} strokeWidth={1.8} />
                                            )}
                                        </div>

                                        {/* Status dot */}
                                        <div className={`
                      absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-bg-primary
                      ${isCompleted ? 'bg-status-success' : isActive ? 'bg-accent-cyan animate-pulse' : 'bg-border-subtle'}
                    `} />
                                    </div>

                                    {/* Step Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                            <h3 className={`
                        font-bold font-mono text-sm md:text-base tracking-wide transition-all duration-300
                        ${isActive ? 'text-accent-cyan' : isCompleted ? 'text-status-success' : 'text-text-primary group-hover:text-accent-red'}
                      `}>
                                                {step.title}
                                            </h3>
                                            {isActive && (
                                                <motion.span
                                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                    className="text-[10px] font-mono text-accent-red px-2 py-0.5 rounded-full bg-accent-red/20"
                                                >
                                                    SCANNING
                                                </motion.span>
                                            )}
                                            {isCompleted && (
                                                <span className="text-[10px] font-mono text-status-success px-2 py-0.5 rounded-full bg-status-success/20">
                                                    COMPLETE
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-text-dim text-xs md:text-sm font-mono">
                                            {step.subtitle}
                                        </p>
                                    </div>

                                    {/* Premium Timer Display */}
                                    <div className="flex-shrink-0">
                                        {timing !== undefined ? (
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-secondary/50 border border-accent-cyan/30"
                                            >
                                                <Timer className="w-3.5 h-3.5 text-accent-cyan" />
                                                <span className="font-mono text-sm font-bold text-accent-cyan">
                                                    {timing.toFixed(1)}s
                                                </span>
                                            </motion.div>
                                        ) : isActive ? (
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-red/10 border border-accent-red/30">
                                                <div className="w-2 h-2 rounded-full bg-accent-red animate-pulse" />
                                                <span className="font-mono text-xs text-accent-red">IN_PROGRESS</span>
                                            </div>
                                        ) : (
                                            <div className="px-3 py-1.5">
                                                <span className="font-mono text-xs text-text-dim/30">—:—</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Animated progress bar for active step */}
                                {isActive && (
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 2.5, ease: "linear" }}
                                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-accent-red via-accent-cyan to-accent-purple rounded-full"
                                        style={{ width: '100%', transformOrigin: 'left' }}
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Footer stats */}
                <div className="px-6 py-3 border-t border-accent-red/20 bg-gradient-to-r from-transparent via-accent-red/5 to-transparent">
                    <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                                <span className="text-text-dim">COMPLETED: {completedSteps.length}/5</span>
                            </div>
                            <div className="w-px h-3 bg-border-subtle" />
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                                <span className="text-text-dim">ACTIVE: {activeStep + 1}</span>
                            </div>
                        </div>
                        <div className="text-text-dim">
                            ESTIMATED REMAINING: {(5 - completedSteps.length) * 2.5}s
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScanChecklist;