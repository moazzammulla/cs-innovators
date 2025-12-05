import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/motionPresets';

const features = [
  {
    title: 'AI Surplus Prediction',
    description:
      'Predict meal surplus per time-slot and cuisine, powered by historical demand and live counters.',
    icon: '🧠',
  },
  {
    title: 'Smart NGO Matching',
    description:
      'Route surplus to the most suitable NGOs in real time using capacity, distance and pickup SLAs.',
    icon: '🌐',
  },
  {
    title: 'Impact Analytics',
    description:
      'Track food saved, CO₂ reduced and communities reached with export-ready reports.',
    icon: '📈',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative mt-28 scroll-mt-24">
      <motion.div
        className="text-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">
          Core Features
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-50 md:text-3xl">
          Built for real-world canteens and mission-driven NGOs.
        </h2>
      </motion.div>

      <motion.div
        className="mt-8 grid gap-5 md:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            variants={fadeInUp}
            whileHover={{ rotateX: -8, rotateY: 8, translateY: -6, boxShadow: '0 22px 45px rgba(16,185,129,0.35)' }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="glass-card group relative flex flex-col overflow-hidden rounded-2xl p-5"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10 space-y-3">
              <motion.div
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror', delay: idx * 0.4 }}
              >
                <span>{feature.icon}</span>
              </motion.div>
              <p className="text-sm font-semibold text-slate-50">{feature.title}</p>
              <p className="text-xs text-slate-300/80">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
