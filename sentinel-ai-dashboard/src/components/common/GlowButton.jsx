import { motion } from 'framer-motion';

const GlowButton = ({
    children,
    onClick,
    variant = 'primary',
    className = '',
    disabled = false,
    icon = null,
    fullWidth = false,
    pulseOnHover = true
}) => {
    const variants = {
        primary: `
      bg-gradient-to-r from-accent-red via-red-600 to-accent-red
      hover:shadow-[0_0_40px_rgba(255,26,60,0.7)]
      text-white border border-accent-red/50
    `,
        secondary: `
      border-2 border-accent-red bg-transparent 
      hover:bg-accent-red/20 hover:shadow-[0_0_30px_rgba(255,26,60,0.4)]
      text-accent-red
    `,
        cyan: `
      bg-gradient-to-r from-accent-cyan via-cyan-600 to-accent-cyan
      hover:shadow-[0_0_40px_rgba(0,229,255,0.7)]
      text-black font-bold border border-accent-cyan/50
    `,
        purple: `
      bg-gradient-to-r from-accent-purple via-purple-600 to-accent-purple
      hover:shadow-[0_0_40px_rgba(157,77,255,0.7)]
      text-white border border-accent-purple/50
    `,
        outline: `
      border border-accent-red/30 bg-bg-panel/50 backdrop-blur
      hover:border-accent-red hover:shadow-[0_0_25px_rgba(255,26,60,0.3)]
      text-text-primary hover:text-accent-red
    `
    };

    return (
        <motion.button
            whileHover={!disabled && pulseOnHover ? {
                scale: 1.05,
                boxShadow: "0 0 30px rgba(255,26,60,0.5)",
                transition: { duration: 0.2 }
            } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onClick}
            disabled={disabled}
            className={`
        relative group overflow-hidden
        px-6 py-3 rounded-xl font-bold font-mono text-sm tracking-wider
        transition-all duration-300 ease-out
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed filter grayscale' : 'cursor-pointer'}
        ${className}
      `}
        >
            {/* Ripple effect on click */}
            <div className="absolute inset-0 opacity-0 group-active:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-white/20 rounded-xl animate-ripple" />
            </div>

            {/* Glow pulse animation */}
            <div className={`absolute inset-0 rounded-xl ${!disabled ? 'animate-pulseGlow' : ''} opacity-50`} />

            <div className="relative z-10 flex items-center justify-center gap-3">
                {icon && <span className="text-xl group-hover:rotate-12 transition-transform duration-300">{icon}</span>}
                <span className="uppercase tracking-wider">{children}</span>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent-red/50 group-hover:border-accent-red transition-colors duration-300" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent-red/50 group-hover:border-accent-red transition-colors duration-300" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent-red/50 group-hover:border-accent-red transition-colors duration-300" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent-red/50 group-hover:border-accent-red transition-colors duration-300" />
        </motion.button>
    );
};

export default GlowButton;