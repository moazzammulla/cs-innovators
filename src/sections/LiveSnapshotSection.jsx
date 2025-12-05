import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { scaleIn } from '../utils/motionPresets';

const useAnimatedCounter = (target, duration = 1500) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();

    const step = (timestamp) => {
      const progress = Math.min(1, (timestamp - start) / duration);
      setValue(Math.round(target * progress));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
};

const LiveSnapshotSection = () => {
  const surplus = useAnimatedCounter(48);
  const meals = useAnimatedCounter(320);

  return (
    <section id="live-snapshot" className="relative mt-28 scroll-mt-24">
      <motion.div
        className="card relative overflow-hidden bg-gradient-to-r from-emerald-600/30 via-emerald-500/20 to-cyan-500/30 text-slate-50 ring-1 ring-emerald-400/40"
        variants={scaleIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <div className="pointer-events-none absolute -inset-32 bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.4),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(34,211,238,0.35),_transparent_55%)] opacity-60" />
        <div className="relative z-10 grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)] md:items-center">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100/90">
              Live Sustainability Snapshot
            </p>
            <h2 className="text-2xl font-semibold md:text-3xl">
              See your impact pulse — updated in real time.
            </h2>
            <p className="text-xs text-emerald-50/80">
              These are mock values, but in production they will reflect your canteen&apos;s and NGOs&apos;
              live operations.
            </p>
            <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
              <div className="rounded-2xl bg-slate-950/40 p-3">
                <p className="text-[11px] text-emerald-100/80">Surplus predicted (today)</p>
                <p className="mt-1 text-3xl font-semibold text-emerald-50">
                  {surplus}
                  <span className="ml-1 text-sm text-emerald-100/80">kg</span>
                </p>
              </div>
              <div className="rounded-2xl bg-slate-950/40 p-3">
                <p className="text-[11px] text-emerald-100/80">Meals saved (this week)</p>
                <p className="mt-1 text-3xl font-semibold text-emerald-50">
                  {meals}
                  <span className="ml-1 text-sm text-emerald-100/80">+</span>
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3 text-xs">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-100/80">
              Timeline
            </p>
            <div className="rounded-2xl bg-slate-950/40 p-3 ring-1 ring-emerald-200/40">
              <div className="flex items-center justify-between text-[11px] text-emerald-100/80">
                <span>Flow status</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                  Live
                </span>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {['Posted', 'NGO Assigned', 'Picked Up', 'Delivered'].map((step, idx) => (
                  <motion.div
                    key={step}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ delay: 0.1 * idx, duration: 0.4 }}
                  >
                    <div className="relative h-6 w-6">
                      <motion.span
                        className="absolute inset-1 rounded-full bg-emerald-400/90"
                        animate={{ scale: [1, 1.18, 1], opacity: [0.9, 1, 0.9] }}
                        transition={{ duration: 1.8, repeat: Infinity, repeatType: 'mirror', delay: idx * 0.3 }}
                      />
                      <span className="absolute inset-0 rounded-full bg-slate-900" />
                    </div>
                    <span className="text-[11px] text-emerald-50">{step}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default LiveSnapshotSection;
