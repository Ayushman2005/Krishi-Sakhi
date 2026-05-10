import React from 'react';
import { motion } from 'framer-motion';

const EnhancedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Primary Glow Orb */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary rounded-full blur-[120px]"
      />

      {/* Secondary Glow Orb */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -40, 0],
          y: [0, 50, 0],
          opacity: [0.08, 0.12, 0.08],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent rounded-full blur-[140px]"
      />

      {/* Tertiary Glow Orb */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 100, 0],
          y: [0, 100, 0],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[30%] right-[20%] w-[400px] h-[400px] bg-secondary rounded-full blur-[100px]"
      />

      {/* Animated Mesh Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(var(--glass-border) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
};

export default EnhancedBackground;
