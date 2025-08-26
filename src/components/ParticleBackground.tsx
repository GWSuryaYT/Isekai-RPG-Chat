import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  drift: number;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 1,
      speedX: Math.random() * 0.2 - 0.1,
      speedY: Math.random() * 0.8 + 0.4,
      drift: Math.random() * 0.05 + 0.02
    });

    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 150; i++) {
        particlesRef.current.push(createParticle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.x += p.speedX + Math.sin(p.y * 0.01) * p.drift;
        p.y += p.speedY;

        if (p.x < -5 || p.x > canvas.width + 5 || p.y > canvas.height + 5) {
          p.x = Math.random() * canvas.width;
          p.y = -10;
        }

        // draw fading tail
        const trailSteps = 6;
        for (let i = 1; i <= trailSteps; i++) {
          const opacity = 0.5 - i * 0.08; // fade out
          const trailX = p.x - p.speedX * i * 4;
          const trailY = p.y - p.speedY * i * 4;

          ctx.beginPath();
          ctx.arc(trailX, trailY, p.size * (1 - i * 0.15), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 200, 200, ${opacity})`;
          ctx.fill();
        }

        // draw main snowflake
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();
    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 2,
        backgroundColor: 'transparent'
      }}
    />
  );
};

export default ParticleBackground;