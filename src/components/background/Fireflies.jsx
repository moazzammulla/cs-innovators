import React from 'react';
import { motion } from 'framer-motion';

const FIREFLIES = [
  { top: '8%', left: '15%', x: 18, y: -26, duration: 14, delay: 0 },
  { top: '20%', left: '70%', x: -24, y: 18, duration: 18, delay: 2 },
  { top: '35%', left: '30%', x: 26, y: 22, duration: 16, delay: 1.4 },
  { top: '48%', left: '80%', x: -30, y: -18, duration: 20, delay: 3.2 },
  { top: '60%', left: '18%', x: 22, y: -26, duration: 17, delay: 4.5 },
  { top: '72%', left: '55%', x: -18, y: 20, duration: 15, delay: 1.8 },
  { top: '15%', left: '90%', x: -16, y: 24, duration: 19, delay: 0.8 },
  { top: '85%', left: '35%', x: 20, y: -20, duration: 21, delay: 2.7 },
];

const Fireflies = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      {/* Edge glow */}
      <div className="pointer-events-none absolute inset-0 border border-emerald-400/10 shadow-[0_0_60px_rgba(16,185,129,0.35)]" />
      {FIREFLIES.map((f, idx) => (
        <motion.span
          key={idx}
          className="absolute h-1.5 w-1.5 rounded-full bg-emerald-300/90 shadow-[0_0_12px_rgba(16,185,129,0.9)]"
          style={{ top: f.top, left: f.left }}
          animate={{
            x: [0, f.x, 0],
            y: [0, f.y, 0],
            opacity: [0.15, 0.9, 0.15],
            scale: [0.8, 1.4, 0.8],
          }}
          transition={{
            duration: f.duration,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: f.delay,
          }}
        />
      ))}
    </div>
  );
};

export default Fireflies;
