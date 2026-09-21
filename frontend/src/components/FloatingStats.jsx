import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Cpu, Leaf, Activity } from 'lucide-react';

const FloatingStats = () => {
  const [time, setTime] = useState(new Date());
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    /* Delay entry to avoid blocking first-paint */
    const show = setTimeout(() => setVisible(true), 1200);
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearTimeout(show);
      clearInterval(tick);
    };
  }, []);

  const pad = n => String(n).padStart(2, '0');
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
  const dateStr = time.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="fixed bottom-24 md:bottom-8 right-6 z-40 pointer-events-none select-none"
    >
      <div
        className="flex flex-col gap-1.5 px-4 py-3 rounded-2xl border border-cyan-500/25 bg-[#030712]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.18)] relative overflow-hidden"
      >
        {/* Subtle top scanner line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

        {/* Live clock */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-cyan-400 animate-pulse" />
            <span className="text-[12px] font-black tracking-widest text-cyan-200 tabular-nums font-[var(--font-mono)]">
              {timeStr}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
            <Activity size={10} className="text-cyan-400 animate-pulse" />
            <span className="text-[8px] font-black text-cyan-300 uppercase tracking-widest font-[var(--font-display)]">TELEMETRY</span>
          </div>
        </div>

        {/* Date */}
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-400/60 pl-5 font-[var(--font-display)]">
          {dateStr}
        </div>

        <div className="border-t border-cyan-500/15 mt-1 pt-2 flex items-center gap-3">
          {/* Model count */}
          <div className="flex items-center gap-1.5">
            <Cpu size={11} className="text-violet-400" />
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider font-[var(--font-display)]">10 Models</span>
          </div>
          {/* Divider */}
          <span className="w-px h-3 bg-cyan-500/20" />
          {/* Status indicator */}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-wider font-[var(--font-display)]">Online</span>
          </div>
          {/* Crops */}
          <span className="w-px h-3 bg-cyan-500/20" />
          <div className="flex items-center gap-1.5">
            <Leaf size={11} className="text-amber-400" />
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider font-[var(--font-display)]">58 Crops</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FloatingStats;
