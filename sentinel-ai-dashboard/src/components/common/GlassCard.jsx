import { motion } from 'framer-motion';

const GlassCard = ({
    children,
    className = '',
    glowColor = 'red',
    hoverGlow = true,
    borderIntensity = 'medium'
}) => {
    const glowStyles = {
        red: {
            border: 'hover:border-accent-red',
            shadow: 'hover:shadow-[0_0_30px_rgba(255,26,60,0.4)]',
            before: 'before:bg-gradient-to-r before:from-transparent before:via-accent-red/20 before:to-transparent'
        },
        cyan: {
            border: 'hover:border-accent-cyan',
            shadow: 'hover:shadow-[0_0_30px_rgba(0,229,255,0.4)]',
            before: 'before:bg-gradient-to-r before:from-transparent before:via-accent-cyan/20 before:to-transparent'
        },
        purple: {
            border: 'hover:border-accent-purple',
            shadow: 'hover:shadow-[0_0_30px_rgba(157,77,255,0.4)]',
            before: 'before:bg-gradient-to-r before:from-transparent before:via-accent-purple/20 before:to-transparent'
        },
        success: {
            border: 'hover:border-status-success',
            shadow: 'hover:shadow-[0_0_30px_rgba(57,255,138,0.4)]',
            before: 'before:bg-gradient-to-r before:from-transparent before:via-status-success/20 before:to-transparent'
        },
    };

    // Safe fallback for unknown glowColor values
    const resolvedGlow = glowStyles[glowColor] ?? glowStyles['red'];

    const intensityMap = {
        low: 'border-border-subtle',
        medium: 'border-accent-red/20',
        high: 'border-accent-red/40'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            whileHover={hoverGlow ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
            className={`
        relative overflow-hidden
        bg-gradient-to-br from-bg-panel/80 via-bg-panel/60 to-bg-secondary/80
        backdrop-blur-xl rounded-2xl
        border ${intensityMap[borderIntensity]}
        transition-all duration-500 ease-out
        ${hoverGlow ? resolvedGlow.border : ''}
        ${hoverGlow ? resolvedGlow.shadow : ''}
        before:absolute before:inset-0 before:translate-x-[-100%] before:animate-shimmer
        ${hoverGlow ? resolvedGlow.before : ''}
        after:absolute after:inset-0 after:rounded-2xl after:pointer-events-none
        after:bg-gradient-to-b after:from-white/5 after:to-transparent
        ${className}
      `}
        >
            {/* Animated border gradient */}
            <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-transparent via-accent-red/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

            {/* Glow overlay on hover */}
            <div className={`absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 ${hoverGlow ? `shadow-[inset_0_0_50px_rgba(255,26,60,0.1)]` : ''}`} />

            {children}
        </motion.div>
    );
};

export default GlassCard;