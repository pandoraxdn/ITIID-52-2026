import {useEffect, useRef} from "react";

export const GoldenParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: {x: number; y: number; vx: number; vy: number; size: number; opacity: number; life: number; maxLife: number; twinkle: number}[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createParticle = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.15,
        size: Math.random() * 5 + 6,
        opacity: 0,
        life: 0,
        maxLife: Math.random() * 250 + 120,
        twinkle: Math.random() * Math.PI * 2,
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (particles.length < 200 && Math.random() > 0.75) createParticle();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.twinkle += 0.05;

        const progress = p.life / p.maxLife;
        let alpha = progress < 0.15 ? progress / 0.15 : progress > 0.75 ? (1 - progress) / 0.25 : 1;
        alpha *= 0.85 + Math.sin(p.twinkle) * 0.15;

        // Outer glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
        gradient.addColorStop(0, `hsla(40, 70%, 65%, ${alpha * 0.9})`);
        gradient.addColorStop(0.4, `hsla(36, 65%, 55%, ${alpha * 0.5})`);
        gradient.addColorStop(1, `hsla(36, 60%, 45%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Bright core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(45, 80%, 80%, ${alpha})`;
        ctx.fill();

        if (p.life >= p.maxLife) particles.splice(i, 1);
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
    />
  );
};
