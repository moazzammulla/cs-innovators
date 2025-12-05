import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { fadeInUp } from '../utils/motionPresets';

const NgoSignupSection = () => {
  return (
    <section id="ngo-signup" className="relative mt-28 scroll-mt-24">
      <motion.div
        className="glass-card grid gap-8 rounded-3xl p-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.1fr)] md:items-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">
            NGO Onboarding
          </p>
          <h2 className="text-2xl font-semibold text-slate-50 md:text-3xl">
            Join the fastest route from surplus to smiles.
          </h2>
          <p className="text-xs text-slate-300/80">
            AI Food Waste Minimizer helps NGOs discover verified canteens, plan optimized pickup
            routes, and prove impact with one unified analytics layer.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-emerald-100/80">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1">No hardware required</span>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1">
              Works with any city size
            </span>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1">
              Designed with NGOs
            </span>
          </div>
          <motion.div className="mt-4 flex items-center gap-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Button className="shadow-[0_0_40px_rgba(16,185,129,0.6)]">
              Sign up as NGO
            </Button>
            <motion.span
              className="hidden items-center gap-1 text-[11px] text-emerald-100/80 sm:flex"
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatType: 'mirror' }}
            >
              <span className="text-lg">→</span>
              <span>Get matched with surplus sources</span>
            </motion.span>
          </motion.div>
        </div>

        <motion.div
          className="relative h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/20 via-slate-900/80 to-cyan-500/20 p-4 ring-1 ring-emerald-400/30 md:h-56"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-cyan-500/30 blur-3xl" />
          <div className="relative z-10 flex h-full flex-col justify-between text-xs text-emerald-50">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-100/90">
                Volunteer Pulse
              </p>
              <p className="mt-1 text-sm font-semibold">3 active routes • 12 volunteers</p>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span>Route readiness</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px]">
                  92%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Cold storage capacity</span>
                <span>1.8 t</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Communities served this week</span>
                <span>24+</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default NgoSignupSection;
