import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../components/ui/Button';
import { fadeInUp } from '../utils/motionPresets';

const HeroSection = () => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex flex-col items-center gap-10 pt-8 md:flex-row md:items-start"
    >
      {/* Animated marquee background */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 opacity-40">
        <div className="marquee text-[11px] uppercase tracking-[0.25em] text-emerald-300/60">
          <div className="marquee__inner">
            {Array.from({ length: 2 }).map((_, idx) => (
              <span key={idx} className="mr-10">
                AI • Sustainability • Zero Hunger • Smart Predictions • NGO Matching • Reduce Waste •
              </span>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        className="flex-1 space-y-6"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <div className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-400/40">
          <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
          AI Food Waste Minimizer • Real-time surplus intelligence
        </div>
        <h1 className="bg-gradient-to-r from-emerald-300 via-lime-200 to-cyan-300 bg-clip-text text-3xl font-semibold leading-tight text-transparent md:text-4xl lg:text-5xl">
          A Futuristic Co-pilot for <span className="font-extrabold">Zero Food Waste</span>
        </h1>
        <p className="max-w-xl text-sm text-slate-200/80 md:text-base">
          Predict surplus before it happens, match canteens with nearby NGOs in seconds, and turn
          potential waste into impact — powered by AI.
        </p>
        <div className="flex flex-col gap-3 text-sm sm:flex-row">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
            <Button size="lg" className="w-full bg-emerald-500 text-slate-950 shadow-[0_0_40px_rgba(16,185,129,0.45)]">
              Start as NGO
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              variant="ghost"
              className="w-full border border-emerald-400/40 bg-emerald-500/5 text-emerald-200"
            >
              Explore Canteen Mode
            </Button>
          </motion.div>
        </div>
        <div className="flex flex-wrap gap-4 text-[11px] text-slate-300/80">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            <span>Predictive surplus alerts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
            <span>Smart NGO routing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />
            <span>Impact-grade analytics</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="glass-card relative flex-1 overflow-hidden rounded-3xl border border-emerald-400/30 p-5 shadow-[0_0_60px_rgba(16,185,129,0.4)]"
        style={{ y: yParallax }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div className="pointer-events-none absolute -right-16 -top-12 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-400/25 blur-3xl" />

        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-200">
          AI System View
        </p>
        <p className="mt-1 text-[11px] text-slate-300/80">
          Live overview of surplus signals, NGO readiness, and impact trajectory.
        </p>

        <div className="mt-4 grid gap-3 text-xs md:grid-cols-2">
          <div className="rounded-2xl bg-slate-900/60 p-3 ring-1 ring-emerald-400/30">
            <p className="text-[11px] text-slate-400">Today&apos;s predicted surplus</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-300">48 kg</p>
            <p className="mt-1 text-[11px] text-emerald-200/70">
              Optimized pickup across 3 verified NGOs.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900/60 p-3 ring-1 ring-cyan-400/30">
            <p className="text-[11px] text-slate-400">Meals saved this week</p>
            <p className="mt-1 text-2xl font-semibold text-cyan-300">320+</p>
            <p className="mt-1 text-[11px] text-cyan-200/70">Across 5 city zones.</p>
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center justify-between text-[11px] text-slate-300/80">
              <span className="font-semibold text-emerald-200">Flow Timeline</span>
              <span className="text-slate-400">Posted → Assigned → Picked Up → Delivered</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 rounded-full bg-slate-900/60 p-2 ring-1 ring-emerald-400/30">
              {['Posted', 'Assigned', 'Picked Up', 'Delivered'].map((label, idx) => (
                <motion.div
                  key={label}
                  className="relative flex flex-1 items-center justify-center"
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + idx * 0.2, duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                >
                  <div className="flex items-center gap-1 text-[10px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    <span className="text-slate-200">{label}</span>
                  </div>
                  {idx < 3 && (
                    <span className="pointer-events-none absolute -right-0.5 h-px w-4 bg-gradient-to-r from-emerald-300/60 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
