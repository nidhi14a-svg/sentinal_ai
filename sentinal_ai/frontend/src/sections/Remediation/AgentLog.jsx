import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader2, CheckCircle2, Terminal, Code2, Server,
    Shield, Lock, Eye, Globe, Zap, CheckCircle,
    Clock, Network, Wrench, RefreshCw
} from 'lucide-react';

const AgentLog = ({ steps, currentStep, completedSteps, stepDetails }) => {
    const logEndRef = useRef(null);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [completedSteps, currentStep]);

    const getStepIcon = (stepId, isCompleted, isActive) => {
        const icons = {
            1: Server,
            2: Shield,
            3: Lock,
            4: Eye,
            5: Globe,
            6: RefreshCw,
            7: Zap,
        };
        const IconComponent = icons[stepId] || Wrench;

        if (isCompleted) {
            return <CheckCircle2 className="w-5 h-5 text-status-success" />;
        }
        if (isActive) {
            return <Loader2 className="w-5 h-5 text-accent-cyan animate-spin" />;
        }
        return <IconComponent className="w-5 h-5 text-text-dim" />;
    };

    return (
        <div className="glass-panel rounded-2xl overflow-hidden border border-accent-red/30 backdrop-blur-xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-accent-red/20 bg-gradient-to-r from-accent-red/5 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-status-critical animate-pulse" />
                        <div className="w-3 h-3 rounded-full bg-status-high" />
                        <div className="w-3 h-3 rounded-full bg-status-low" />
                    </div>
                    <Terminal className="w-4 h-4 text-accent-cyan" />
                    <span className="text-xs font-mono text-accent-cyan tracking-wider">AGENT_EXECUTION_LOG</span>
                    <div className="flex-1" />
                    <span className="text-[10px] font-mono text-text-dim">LIVE_STREAM</span>
                </div>
            </div>

            {/* Log Entries */}
            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scroll">
                {steps.map((step) => {
                    const isCompleted = completedSteps.includes(step.id);
                    const isActive = currentStep === step.id && !isCompleted;
                    const details = stepDetails[step.id];

                    return (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: step.id * 0.1 }}
                            className="relative"
                        >
                            {/* Connecting Line */}
                            {step.id < steps.length && (
                                <div className="absolute left-6 top-10 bottom-0 w-px">
                                    <motion.div
                                        initial={{ scaleY: 0 }}
                                        animate={{ scaleY: isCompleted || isActive ? 1 : 0 }}
                                        transition={{ duration: 0.5, delay: step.id * 0.2 }}
                                        className="w-full h-full bg-gradient-to-b from-accent-red via-accent-cyan to-accent-purple"
                                        style={{ transformOrigin: 'top' }}
                                    />
                                </div>
                            )}

                            <div className="relative flex gap-4">
                                {/* Status Icon */}
                                <div className={`
                  relative z-10 w-12 h-12 rounded-xl flex items-center justify-center
                  bg-gradient-to-br from-bg-secondary to-bg-panel
                  border-2 transition-all duration-300
                  ${isCompleted ? 'border-status-success shadow-glowSuccess' : ''}
                  ${isActive ? 'border-accent-cyan shadow-glowCyan animate-pulse' : 'border-border-subtle'}
                `}>
                                    {getStepIcon(step.id, isCompleted, isActive)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className={`
                      font-bold font-mono text-sm md:text-base transition-all duration-300
                      ${isCompleted ? 'text-status-success' : isActive ? 'text-accent-cyan' : 'text-text-primary'}
                    `}>
                                            {step.title}
                                        </h3>
                                        {details?.timestamp && (
                                            <div className="flex items-center gap-1 text-xs font-mono text-text-dim">
                                                <Clock className="w-3 h-3" />
                                                <span>{details.timestamp}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Sub-text */}
                                    <AnimatePresence>
                                        {(isCompleted || isActive) && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <p className="text-text-secondary text-xs md:text-sm font-mono mb-2">
                                                    {step.subText}
                                                </p>

                                                {/* Code Snippet */}
                                                {details?.code && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        transition={{ duration: 0.4 }}
                                                        className="mt-2"
                                                    >
                                                        <div className="relative group">
                                                            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-accent-red rounded-full" />
                                                            <div className="bg-bg-primary/80 rounded-lg p-3 border border-accent-cyan/20 font-mono text-xs overflow-x-auto">
                                                                <code className="text-accent-cyan">
                                                                    {details.code}
                                                                </code>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {/* Success indicator */}
                                                {isCompleted && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded bg-status-success/10 border border-status-success/30"
                                                    >
                                                        <CheckCircle className="w-3 h-3 text-status-success" />
                                                        <span className="text-[10px] font-mono text-status-success">COMPLETED</span>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
                <div ref={logEndRef} />
            </div>
        </div>
    );
};

export default AgentLog;