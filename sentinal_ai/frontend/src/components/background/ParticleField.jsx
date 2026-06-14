import { useEffect, useRef } from 'react';

const ParticleField = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let particles = [];
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let time = 0;
        let animationId;

        // Cyberpunk color palette
        const colors = {
            red: '#ff1a3c',
            cyan: '#00e5ff',
            purple: '#9d4dff',
            darkRed: '#a3122a',
            darkCyan: '#0088aa',
            darkPurple: '#6622cc'
        };

        class Particle3D {
            constructor(x, y, z) {
                this.x = x;
                this.y = y;
                this.z = z;
                this.size = 1.5;
                this.color = this.getColor();
                this.velocityX = (Math.random() - 0.5) * 0.3;
                this.velocityY = (Math.random() - 0.5) * 0.3;
                this.velocityZ = (Math.random() - 0.5) * 0.5;
                this.originalX = x;
                this.originalY = y;
                this.waveSpeed = 0.02 + Math.random() * 0.03;
                this.waveAmplitude = 20 + Math.random() * 30;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            }

            getColor() {
                const rand = Math.random();
                if (rand < 0.33) return colors.red;
                if (rand < 0.66) return colors.cyan;
                return colors.purple;
            }

            update(mouseInfluence) {
                // 3D movement with wave patterns
                time += 0.01;
                this.rotation += this.rotationSpeed;

                // Wave motion on X and Y
                this.x = this.originalX + Math.sin(time * this.waveSpeed) * this.waveAmplitude;
                this.y = this.originalY + Math.cos(time * this.waveSpeed * 0.7) * this.waveAmplitude;

                // Z-axis pulsation
                this.z += this.velocityZ;
                if (this.z > 200 || this.z < -200) {
                    this.velocityZ *= -1;
                }

                // Mouse influence - 3D depth effect
                if (mouseInfluence) {
                    const dx = mouseX - this.x;
                    const dy = mouseY - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const maxDistance = 200;

                    if (distance < maxDistance) {
                        const force = (maxDistance - distance) / maxDistance;
                        const angle = Math.atan2(dy, dx);
                        this.x += Math.cos(angle) * force * 3;
                        this.y += Math.sin(angle) * force * 3;
                        this.z -= force * 5;
                    }
                }

                // Wrap around
                if (this.x < -100) this.x = canvas.width + 100;
                if (this.x > canvas.width + 100) this.x = -100;
                if (this.y < -100) this.y = canvas.height + 100;
                if (this.y > canvas.height + 100) this.y = -100;
            }

            draw(ctx) {
                // Calculate perspective based on Z (clamp to prevent negative size)
                const perspective = Math.max(0.01, (this.z + 200) / 400);
                const size = Math.max(0.1, this.size * (0.5 + perspective));
                const opacity = Math.min(1, Math.max(0.1, 0.2 + (perspective * 0.4)));

                ctx.save();

                // Glow effect based on depth
                ctx.shadowBlur = size * 4;
                ctx.shadowColor = this.color;

                // Main particle with 3D perspective
                ctx.beginPath();
                ctx.arc(this.x, this.y, size, 0, Math.PI * 2);

                // Gradient fill for 3D look
                const gradient = ctx.createRadialGradient(
                    this.x - size * 0.3, this.y - size * 0.3, size * 0.2,
                    this.x, this.y, size
                );
                gradient.addColorStop(0, 'white');
                gradient.addColorStop(0.3, this.color);
                gradient.addColorStop(1, 'transparent');

                ctx.fillStyle = gradient;
                ctx.globalAlpha = opacity;
                ctx.fill();

                // Outer glow ring
                ctx.beginPath();
                ctx.arc(this.x, this.y, size * 2, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = opacity * 0.3;
                ctx.fill();

                ctx.restore();
            }
        }

        const initParticles = () => {
            const particleCount = Math.min(120, Math.floor(window.innerWidth * window.innerHeight / 10000));
            particles = [];

            for (let i = 0; i < particleCount; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const z = (Math.random() - 0.5) * 400;
                particles.push(new Particle3D(x, y, z));
            }
        };

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connecting lines between particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update(true);
                particles[i].draw(ctx);

                // Connect nearby particles with glow lines
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);

                        const opacity = (1 - distance / 150) * 0.15;
                        const gradient = ctx.createLinearGradient(
                            particles[i].x, particles[i].y,
                            particles[j].x, particles[j].y
                        );
                        gradient.addColorStop(0, particles[i].color);
                        gradient.addColorStop(1, particles[j].color);

                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = 1;
                        ctx.shadowBlur = 3;
                        ctx.shadowColor = particles[i].color;
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(animate);
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
            style={{ zIndex: 0, opacity: 0.8 }}
        />
    );
};

export default ParticleField;