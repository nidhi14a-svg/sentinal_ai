import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const AnimatedCounter = ({
    target,
    duration = 1500,
    prefix = '',
    suffix = '',
    startOnMount = true,
    delay = 0
}) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "0px" });
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        if (!startOnMount && !isInView) return;
        if (hasStarted) return;

        const startDelay = setTimeout(() => {
            let startTime = null;
            let animationFrame = null;

            const animate = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Cubic bezier easing for dramatic effect
                const easeOutElastic = (x) => {
                    const c4 = (2 * Math.PI) / 3;
                    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
                };

                const easedProgress = easeOutElastic(progress);
                const currentValue = Math.floor(easedProgress * target);

                setCount(currentValue);

                if (progress < 1) {
                    animationFrame = requestAnimationFrame(animate);
                }
            };

            animationFrame = requestAnimationFrame(animate);
            setHasStarted(true);

            return () => {
                if (animationFrame) cancelAnimationFrame(animationFrame);
            };
        }, delay);

        return () => clearTimeout(startDelay);
    }, [target, duration, startOnMount, isInView, hasStarted, delay]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-mono font-black bg-gradient-to-r from-text-primary to-accent-red bg-clip-text text-transparent"
        >
            {prefix}{count.toLocaleString()}{suffix}
        </motion.div>
    );
};

export default AnimatedCounter;