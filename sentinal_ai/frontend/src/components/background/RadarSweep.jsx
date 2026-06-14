import { useEffect, useRef } from 'react';

const RadarSweep = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let angle = 0;
        let animationId;
        let mouseX = 0;
        let mouseY = 0;

        const drawRadar = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const centerX = mouseX || canvas.width / 2;
            const centerY = mouseY || canvas.height / 2;
            const radius = 150;

            // Draw radar circles
            for (let i = 1; i <= 3; i++) {
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius * (i / 3), 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(0, 229, 255, ${0.1 - i * 0.02})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Draw crosshairs
            ctx.beginPath();
            ctx.moveTo(centerX - radius, centerY);
            ctx.lineTo(centerX + radius, centerY);
            ctx.moveTo(centerX, centerY - radius);
            ctx.lineTo(centerX, centerY + radius);
            ctx.strokeStyle = 'rgba(255, 26, 60, 0.2)';
            ctx.stroke();

            // Draw sweeping line
            const radian = (angle * Math.PI) / 180;
            const endX = centerX + Math.cos(radian) * radius;
            const endY = centerY + Math.sin(radian) * radius;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = 'rgba(255, 26, 60, 0.6)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw sweep gradient
            const sweepGradient = ctx.createLinearGradient(centerX, centerY, endX, endY);
            sweepGradient.addColorStop(0, 'rgba(255, 26, 60, 0.3)');
            sweepGradient.addColorStop(1, 'rgba(255, 26, 60, 0)');

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(endX, endY);
            ctx.lineTo(endX + Math.sin(radian) * 20, endY - Math.cos(radian) * 20);
            ctx.fillStyle = sweepGradient;
            ctx.fill();

            // Detect "blips" (random dots appearing on radar)
            if (Math.random() < 0.05) {
                const blipAngle = Math.random() * Math.PI * 2;
                const blipRadius = Math.random() * radius;
                const blipX = centerX + Math.cos(blipAngle) * blipRadius;
                const blipY = centerY + Math.sin(blipAngle) * blipRadius;

                ctx.beginPath();
                ctx.arc(blipX, blipY, 4, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 26, 60, 0.8)';
                ctx.fill();

                ctx.beginPath();
                ctx.arc(blipX, blipY, 8, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 26, 60, 0.3)';
                ctx.fill();
            }

            angle = (angle + 2) % 360;
        };

        const animate = () => {
            drawRadar();
            animationId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        handleResize();
        animate();

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 2, opacity: 0.5 }}
        />
    );
};

export default RadarSweep;
