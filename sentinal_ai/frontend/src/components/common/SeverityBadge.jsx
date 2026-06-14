import { motion } from 'framer-motion';

const SeverityBadge = ({ severity, size = 'md', showIcon = true, animated = true }) => {
    const severityConfig = {
        CRITICAL: {
            color: 'text-status-critical',
            bg: 'bg-gradient-to-r from-status-critical/30 to-red-900/30',
            border: 'border-status-critical/70',
            shadow: 'shadow-[0_0_15px_rgba(255,26,60,0.5)]',
            icon: '💀',
            glow: 'animate-pulseGlow'
        },
        HIGH: {
            color: 'text-status-high',
            bg: 'bg-gradient-to-r from-status-high/30 to-orange-900/30',
            border: 'border-status-high/70',
            shadow: 'shadow-[0_0_12px_rgba(255,107,53,0.4)]',
            icon: '⚠️',
            glow: ''
        },
        MEDIUM: {
            color: 'text-status-medium',
            bg: 'bg-gradient-to-r from-status-medium/30 to-yellow-900/30',
            border: 'border-status-medium/70',
            shadow: 'shadow-[0_0_10px_rgba(255,184,77,0.3)]',
            icon: '🔶',
            glow: ''
        },
        LOW: {
            color: 'text-status-low',
            bg: 'bg-gradient-to-r from-status-low/30 to-green-900/30',
            border: 'border-status-low/70',
            shadow: 'shadow-[0_0_8px_rgba(61,217,179,0.3)]',
            icon: '🟢',
            glow: ''
        }
    };

    const config = severityConfig[severity] || severityConfig.MEDIUM;

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs gap-1',
        md: 'px-3 py-1 text-sm gap-1.5',
        lg: 'px-4 py-1.5 text-base gap-2'
    };

    const fontSizes = {
        sm: 'text-[10px]',
        md: 'text-xs',
        lg: 'text-sm'
    };

    return (
        <motion.div
            initial={animated ? { scale: 0, rotate: -180, opacity: 0 } : false}
            animate={animated ? { scale: 1, rotate: 0, opacity: 1 } : {}}
            transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            className={`
        inline-flex items-center rounded-full font-mono font-black uppercase tracking-wider
        backdrop-blur-sm border ${config.bg} ${config.color} ${config.border}
        ${sizeClasses[size]} ${config.glow}
      `}
            style={{ boxShadow: config.shadow }}
        >
            {showIcon && (
                <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-base"
                >
                    {config.icon}
                </motion.span>
            )}
            <span className={fontSizes[size]}>{severity}</span>

            {/* Scanning line effect on critical */}
            {severity === 'CRITICAL' && (
                <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-scanline-fast" />
                </div>
            )}
        </motion.div>
    );
};

export default SeverityBadge;