import { useEffect, useRef } from 'react';

const GridBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;
        let time = 0;
        let mouseX = 0;
        let mouseY = 0;

        const drawGrid = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const gridSize = 50;
            const perspective = 800;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // Mouse influence for 3D perspective shift
            const offsetX = (mouseX - centerX) / 50;
            const offsetY = (mouseY - centerY) / 50;

            // Draw horizontal lines with 3D perspective
            for (let z = -5; z <= 5; z++) {
                const scale = perspective / (perspective + z * 30);
                const yOffset = centerY + z * 40 + offsetY * z;

                if (yOffset < 0 || yOffset > canvas.height) continue;

                ctx.beginPath();

                for (let x = -20; x <= 20; x++) {
                    const xPos = centerX + x * gridSize * scale + offsetX * (z + 5);
                    const yPos = yOffset;

                    if (x === -20) {
                        ctx.moveTo(xPos, yPos);
                    } else {
                        ctx.lineTo(xPos, yPos);
                    }
                }

                // Gradient based on depth
                const depth = Math.abs(z);
                const opacity = 0.15 - depth * 0.02;
                const lineWidth = 1 - depth * 0.1;

                ctx.strokeStyle = `rgba(255, 26, 60, ${opacity})`;
                ctx.lineWidth = lineWidth;
                ctx.stroke();
            }

            // Draw vertical lines with 3D perspective
            for (let x = -20; x <= 20; x++) {
                ctx.beginPath();

                for (let z = -5; z <= 5; z++) {
                    const scale = perspective / (perspective + z * 30);
                    const xPos = centerX + x * gridSize * scale + offsetX * (z + 5);
                    const yPos = centerY + z * 40 + offsetY * z;

                    if (z === -5) {
                        ctx.moveTo(xPos, yPos);
                    } else {
                        ctx.lineTo(xPos, yPos);
                    }
                }

                const depth = Math.abs(x) / 20;
                const opacity = 0.1 - depth * 0.05;

                ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }

            // Draw animated data streams
            for (let i = 0; i < 30; i++) {
                const streamX = (i * 50 + time * 2) % canvas.width;
                const streamY = (Math.sin(time * 0.003 + i) * 100 + centerY);

                ctx.beginPath();
                ctx.moveTo(streamX, streamY);
                ctx.lineTo(streamX - 20, streamY + 30);
                ctx.lineTo(streamX + 20, streamY + 30);
                ctx.fillStyle = `rgba(157, 77, 255, ${0.1 + Math.sin(time * 0.005 + i) * 0.05})`;
                ctx.fill();
            }
        };

        const animate = () => {
            time++;
            drawGrid();
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
            style={{ zIndex: 0, opacity: 0.4 }}
        />
    );
};

export default GridBackground;