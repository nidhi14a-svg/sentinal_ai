import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../../components/common/GlassCard';

const ReportSection = ({ title, icon: Icon, color, children, delay = 0, badge = null }) => {
    const colorStyles = {
        cyan: 'border-accent-cyan text-accent-cyan',
        orange: 'border-status-high text-status-high',
        purple: 'border-accent-purple text-accent-purple',
        green: 'border-status-success text-status-success',
        red: 'border-accent-red text-accent-red',
    };

    const glowStyles = {
        cyan: 'shadow-glowCyan',
        orange: 'shadow-orange-500/30',
        purple: 'shadow-glowPurple',
        green: 'shadow-glowSuccess',
        red: 'shadow-glowRed',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, duration: 0.6, ease: [0.25, 0.1, 0.25, 1], type: "spring", stiffness: 100 }}
            className="mb-6"
        >
            <GlassCard
                glowColor={color === 'cyan' ? 'cyan' : color === 'green' ? 'red' : color === 'purple' ? 'purple' : 'red'}
                className="overflow-hidden group hover:shadow-2xl transition-all duration-500"
                borderIntensity="medium"
            >
                {/* Animated gradient top bar */}
                <div className={`h-1 bg-gradient-to-r ${color === 'cyan' ? 'from-accent-cyan via-blue-500 to-accent-cyan' : color === 'orange' ? 'from-status-high via-orange-500 to-status-high' : color === 'purple' ? 'from-accent-purple via-purple-500 to-accent-purple' : 'from-status-success via-green-500 to-status-success'} animate-gradient-x`} />

                {/* Section Header */}
                <div className="flex items-center gap-4 p-5 pb-3 border-b border-border-subtle">
                    <div className="relative">
                        <div className={`absolute inset-0 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${glowStyles[color]}`} />
                        <div className={`relative p-2.5 rounded-xl bg-gradient-to-br from-bg-secondary to-bg-panel border ${colorStyles[color]} border-opacity-30`}>
                            <Icon className={`w-5 h-5 ${colorStyles[color]}`} />
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">{title}</h2>
                            {badge && (
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full bg-${color === 'cyan' ? 'accent-cyan' : color === 'green' ? 'status-success' : 'accent-purple'}/20 border border-current ${colorStyles[color]}`}>
                                    {badge}
                                </span>
                            )}
                        </div>
                        <div className={`w-12 h-px ${colorStyles[color]} bg-current opacity-50 mt-1 group-hover:w-24 transition-all duration-500`} />
                    </div>

                    <div className={`w-1 h-8 rounded-full ${colorStyles[color]} bg-current opacity-30 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>

                {/* Section Content */}
                <div className="p-5 text-text-secondary leading-relaxed">
                    {children}
                </div>
            </GlassCard>
        </motion.div>
    );
};

export default ReportSection;