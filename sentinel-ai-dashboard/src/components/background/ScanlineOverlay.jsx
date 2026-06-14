import { useEffect, useRef } from 'react';

const ScanlineOverlay = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;
        let scanY = 0;
        let scanDirection = 1;
        let time = 0;

        const drawOverlay = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. CRT Scanlines
            const lineHeight = 2;
            for (let y = 0; y < canvas.height; y += lineHeight * 2) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
                ctx.fillRect(0, y, canvas.width, lineHeight);
            }

            // 2. Animated Scanning Line with Glow
            const gradient = ctx.createLinearGradient(0, scanY, 0, scanY + 80);
            gradient.addColorStop(0, 'rgba(255, 26, 60, 0)');
            gradient.addColorStop(0.3, 'rgba(255, 26, 60, 0.4)');
            gradient.addColorStop(0.5, 'rgba(255, 26, 60, 0.8)');
            gradient.addColorStop(0.7, 'rgba(255, 26, 60, 0.4)');
            gradient.addColorStop(1, 'rgba(255, 26, 60, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, scanY - 40, canvas.width, 120);

            // Bright core line
            ctx.fillStyle = 'rgba(255, 26, 60, 0.9)';
            ctx.fillRect(0, scanY - 1, canvas.width, 2);

            // 3. Vignette Effect
            const vignetteGradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, canvas.height / 3,
                canvas.width / 2, canvas.height / 2, canvas.height / 1.5
            );
            vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
            vignetteGradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.1)');
            vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');

            ctx.fillStyle = vignetteGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 4. Glitch Effect (random horizontal bars)
            if (Math.random() < 0.02) {
                const glitchY = Math.random() * canvas.height;
                const glitchHeight = 5 + Math.random() * 15;

                ctx.fillStyle = `rgba(255, 26, 60, ${0.3 + Math.random() * 0.3})`;
                ctx.fillRect(0, glitchY, canvas.width, glitchHeight);

                // Color shift glitch
                ctx.fillStyle = `rgba(0, 229, 255, ${0.2 + Math.random() * 0.2})`;
                ctx.fillRect(Math.random() * 50, glitchY + glitchHeight, canvas.width - (Math.random() * 100), glitchHeight);
            }

            // 5. Holographic distortion waves
            for (let i = 0; i < 3; i++) {
                const waveY = (Math.sin(time * 0.005 + i) * 20) + canvas.height / 2;
                ctx.beginPath();

                for (let x = 0; x < canvas.width; x += 10) {
                    const waveX = x + Math.sin(time * 0.01 + x * 0.01) * 5;
                    if (x === 0) {
                        ctx.moveTo(waveX, waveY);
                    } else {
                        ctx.lineTo(waveX, waveY + Math.sin(x * 0.02 + time * 0.008) * 10);
                    }
                }

                ctx.strokeStyle = `rgba(0, 229, 255, 0.15)`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // 6. Digital rain effect at edges
            for (let i = 0; i < 50; i++) {
                const x = (time * 2 + i * 30) % canvas.width;
                const y = (Math.sin(time * 0.01 + i) * canvas.height) % canvas.height;

                ctx.fillStyle = `rgba(157, 77, 255, ${0.1 + Math.sin(time * 0.02 + i) * 0.05})`;
                ctx.fillRect(x, y, 2, 15);
            }

            // Update scan position
            scanY += scanDirection * 1.5;
            if (scanY > canvas.height + 100) {
                scanY = -100;
            }

            time++;
        };

        const animate = () => {
            drawOverlay();
            animationId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        handleResize();
        animate();

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1, opacity: 0.8 }}
        />
    );
};

export default ScanlineOverlay;