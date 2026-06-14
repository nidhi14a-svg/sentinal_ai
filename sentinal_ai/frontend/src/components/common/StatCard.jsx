import GlassCard from './GlassCard';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

const StatCard = ({
    label,
    value,
    icon: Icon,
    trend = null,
    trendValue = null,
    glowColor = 'red',
    subtitle = null,
    animated = true
}) => {
    return (
        <GlassCard glowColor={glowColor} className="relative group">
            {/* Background matrix rain effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSIjZmYxYTNjIi8+PC9zdmc+')] bg-repeat animate-matrix" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-accent-red/10 border border-accent-red/30 group-hover:shadow-glowRed transition-all duration-300">
                        {Icon && <Icon className="text-accent-red w-6 h-6 group-hover:scale-110 transition-transform duration-300" />}
                    </div>

                    {trend && (
                        <motion.div
                            initial={{ x: 10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-md font-mono text-sm font-bold backdrop-blur-sm
                ${trend === 'up' ? 'bg-status-success/20 text-status-success border border-status-success/30' : 'bg-status-critical/20 text-status-critical border border-status-critical/30'}`}
                        >
                            <span className="text-lg">{trend === 'up' ? '▲' : '▼'}</span>
                            <span>{trendValue}%</span>
                        </motion.div>
                    )}
                </div>

                <motion.div
                    initial={animated ? { scale: 0.8, opacity: 0 } : false}
                    animate={animated ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.1, type: "spring" }}
                    className="text-5xl md:text-6xl font-black text-text-primary mb-2 font-mono tracking-tighter"
                >
                    {animated ? <AnimatedCounter target={typeof value === 'number' ? value : parseInt(value)} /> : value}
                </motion.div>

                <div className="text-text-secondary text-sm font-bold uppercase tracking-wider mb-1">
                    {label}
                </div>

                {subtitle && (
                    <div className="text-text-dim text-xs mt-2 font-mono flex items-center gap-1">
                        <span className="inline-block w-1 h-1 rounded-full bg-accent-red animate-pulse" />
                        {subtitle}
                    </div>
                )}
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-accent-red/5 via-transparent to-transparent" />
            </div>
        </GlassCard>
    );
};

export default StatCard;