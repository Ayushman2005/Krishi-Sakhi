import { useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';

/* ─── Static quantum nodes / cyber particles ─── */
const PARTICLES = Array.from({ length: 65 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: 0.6 + Math.random() * 1.8,
  dur: 2.5 + Math.random() * 4.5,
  delay: Math.random() * 3,
  opacity: 0.12 + Math.random() * 0.35,
  isCyan: i % 2 === 0,
}));

const EnhancedBackground = memo(() => {
  const canvasRef = useRef(null);

  /* ─── High-Tech Matrix HUD Grid on Canvas (GPU-accelerated) ─── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let raf;
    let tick = 0;

    const draw = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* Cybernetic HUD Grid */
      const spacing = 75;
      const cols = Math.ceil(canvas.width / spacing) + 1;
      const rows = Math.ceil(canvas.height / spacing) + 1;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = c * spacing;
          const y = r * spacing;
          const pulse = Math.sin((tick * 0.015) + c * 0.35 + r * 0.35) * 0.5 + 0.5;
          const alpha = 0.03 + pulse * 0.08;

          /* Subtle grid intersection crosshairs */
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(x - 3, y);
          ctx.lineTo(x + 3, y);
          ctx.moveTo(x, y - 3);
          ctx.lineTo(x, y + 3);
          ctx.stroke();

          /* Occasional micro-dots */
          if ((c + r) % 3 === 0) {
            ctx.beginPath();
            ctx.arc(x, y, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(34, 211, 238, ${alpha * 1.5})`;
            ctx.fill();
          }
        }
      }

      /* Moving Cyan Laser Scan-beam */
      const scanY = ((tick * 0.65) % (canvas.height + 120)) - 60;
      const laserGradient = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      laserGradient.addColorStop(0, 'transparent');
      laserGradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.06)');
      laserGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = laserGradient;
      ctx.fillRect(0, scanY - 30, canvas.width, 60);

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* ── 1. Cyber Nebula Orb: Neon Cyan (Top-Left) ── */}
      <motion.div
        animate={{
          scale: [1, 1.28, 1],
          x: [0, 50, 0],
          y: [0, -35, 0],
          opacity: [0.16, 0.24, 0.16],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-15%] left-[-15%] w-[620px] h-[620px] rounded-full blur-[140px]"
        style={{ backgroundColor: '#06b6d4' }}
      />

      {/* ── 2. Cyber Nebula Orb: Electric Violet (Bottom-Right) ── */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -60, 0],
          y: [0, 50, 0],
          opacity: [0.12, 0.2, 0.12],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-15%] right-[-15%] w-[700px] h-[700px] rounded-full blur-[160px]"
        style={{ backgroundColor: '#8b5cf6' }}
      />

      {/* ── 3. Holographic Cyan Pulse Orb (Center Right) ── */}
      <motion.div
        animate={{
          scale: [1, 1.35, 1],
          x: [0, 80, 0],
          y: [0, 70, 0],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[25%] right-[15%] w-[480px] h-[480px] rounded-full blur-[130px]"
        style={{ backgroundColor: '#22d3ee' }}
      />

      {/* ── 4. Deep Indigo Space Drift (Bottom-Left) ── */}
      <motion.div
        animate={{
          scale: [1, 1.22, 0.95, 1],
          x: [0, -70, 40, 0],
          y: [0, 60, -35, 0],
          opacity: [0.06, 0.12, 0.08, 0.06],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[60%] left-[5%] w-[520px] h-[520px] rounded-full blur-[140px]"
        style={{ backgroundColor: '#4f46e5' }}
      />

      {/* ── 5. Cybernetic Light Streaks / Diagonal Data Beams ── */}
      <motion.div
        animate={{
          x: ['-100%', '200%'],
          opacity: [0, 0.25, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
          delay: 1,
        }}
        className="absolute top-1/4 -left-1/4 w-[150%] h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent -rotate-12 blur-[0.5px]"
      />
      <motion.div
        animate={{
          x: ['-100%', '200%'],
          opacity: [0, 0.2, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'linear',
          delay: 5,
        }}
        className="absolute top-2/3 -left-1/4 w-[150%] h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent -rotate-12 blur-[0.5px]"
      />

      {/* ── 6. Quantum Node Particles ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {PARTICLES.map(p => (
          <circle
            key={p.id}
            cx={`${p.x}%`}
            cy={`${p.y}%`}
            r={p.r}
            fill={p.isCyan ? '#22d3ee' : '#c084fc'}
            opacity={p.opacity}
          >
            <animate
              attributeName="opacity"
              values={`${p.opacity};${p.opacity * 2.8};${p.opacity}`}
              dur={`${p.dur}s`}
              begin={`${p.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>

      {/* ── 7. Interactive Canvas Grid & Scanline ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.75 }}
      />
    </div>
  );
});

EnhancedBackground.displayName = 'EnhancedBackground';

export default EnhancedBackground;
