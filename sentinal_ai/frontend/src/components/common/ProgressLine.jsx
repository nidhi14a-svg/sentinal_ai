import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const ProgressLine = ({
    progress,
    showLabel = true,
    height = 'h-2',
    color = 'red',
    animated = true,
    glow = true,
    showGlowEffect = true
}) => {
    const [currentProgress, setCurrentProgress] = useState(0);
    const progressRef = useRef(null);

    const colorStyles = {
        red: {
            bg: 'bg-gradient-to-r from-accent-red via-red-500 to-accent-red',
            shadow: 'shadow-glowRed',
            text: 'text-accent-red'
        },
        cyan: {
            bg: 'bg-gradient-to-r from-accent-cyan via-cyan-500 to-accent-cyan',
            shadow: 'shadow-glowCyan',
            text: 'text-accent-cyan'
        },
        purple: {
            bg: 'bg-gradient-to-r from-accent-purple via-purple-500 to-accent-purple',
            shadow: 'shadow-glowPurple',
            text: 'text-accent-purple'
        },
        success: {
            bg: 'bg-gradient-to-r from-status-success via-green-500 to-status-success',
            shadow: 'shadow-glowSuccess',
            text: 'text-status-success'
        }
    };

    useEffect(() => {
        if (animated) {
            const controls = animate(0, progress, {
                duration: 1.2,
                ease: "easeOut",
                onUpdate: (value) => setCurrentProgress(value)
            });
            return () => controls.stop();
        } else {
            setCurrentProgress(progress);
        }
    }, [progress, animated]);

    return (
        <div className="w-full group">
            {showLabel && (
                <div className="flex justify-between mb-2 text-sm font-mono">
                    <span className="text-text-secondary flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse" />
                        SYSTEM_PROGRESS
                    </span>
                    <motion.span
                        className={`font-bold ${colorStyles[color].text}`}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                    >
                        {Math.round(currentProgress)}%
                    </motion.span>
                </div>
            )}

            <div className={`relative w-full bg-bg-secondary/80 rounded-full overflow-hidden ${glow && showGlowEffect ? 'shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]' : ''}`}>
                <motion.div
                    ref={progressRef}
                    initial={{ width: 0 }}
                    animate={{ width: `${currentProgress}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className={`
            ${height} rounded-full relative
            ${colorStyles[color].bg}
          `}
                >
                    {/* Animated shine/scan effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-fast" />

                    {/* Glow pulse on fill */}
                    {showGlowEffect && (
                        <div className={`absolute inset-0 rounded-full ${colorStyles[color].shadow} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
                    )}

                    {/* Particle effects on progress */}
                    {currentProgress > 0 && currentProgress < 100 && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2">
                            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                        </div>
                    )}
                </motion.div>

                {/* Glow behind progress bar */}
                {glow && (
                    <div
                        className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-300 ${colorStyles[color].bg} opacity-0 group-hover:opacity-30`}
                        style={{ width: `${currentProgress}%` }}
                    />
                )}
            </div>

            {/* Progress percentage ticks */}
            {showLabel && (
                <div className="flex justify-between mt-1 px-1">
                    {[0, 25, 50, 75, 100].map(tick => (
                        <div key={tick} className="flex flex-col items-center">
                            <div className="w-px h-1 bg-border-subtle" />
                            <span className="text-[10px] text-text-dim font-mono">{tick}%</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProgressLine;