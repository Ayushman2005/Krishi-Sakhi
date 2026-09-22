import { memo } from 'react';
import { motion } from 'framer-motion';

const EnhancedBackground = memo(() => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#090c0b]">
      {/* ── Soft, Organic Ambient Glow (Top Center) ── */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full blur-[140px]"
        style={{ backgroundColor: '#10b981' }}
      />

      {/* ── Gentle Slate Undertone (Bottom Right) ── */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.03, 0.06, 0.03],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-40 -right-20 w-[600px] h-[500px] rounded-full blur-[160px]"
        style={{ backgroundColor: '#22c55e' }}
      />
    </div>
  );
});

EnhancedBackground.displayName = 'EnhancedBackground';

export default EnhancedBackground;
