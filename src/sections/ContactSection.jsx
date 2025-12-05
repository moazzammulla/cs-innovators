import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { fadeInUp } from '../utils/motionPresets';

const ContactSection = () => {
  return (
    <section id="contact" className="relative mt-28 scroll-mt-24">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 p-6 ring-1 ring-emerald-400/30">
        <div className="contact-pattern" />
        <motion.div
          className="relative z-10 grid gap-8 md:grid-cols-2 md:items-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">
              Contact
            </p>
            <h2 className="text-2xl font-semibold text-slate-50 md:text-3xl">
              Let&apos;s design a zero-waste city together.
            </h2>
            <p className="text-xs text-slate-300/80">
              Share a bit about your canteen or NGO, and we&apos;ll reach out with a tailored demo
              journey and mock analytics for your environment.
            </p>
          </div>

          <form className="space-y-4 text-sm">
            <div className="grid gap-3 md:grid-cols-2">
              <FloatingField label="Name" id="name" type="text" />
              <FloatingField label="Email" id="email" type="email" />
            </div>
            <FloatingField label="Organization" id="organization" type="text" />
            <FloatingTextarea label="How can we help?" id="message" />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="pt-1">
              <Button className="w-full bg-emerald-500 text-slate-950 shadow-[0_0_35px_rgba(16,185,129,0.6)]">
                Submit
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

const FloatingField = ({ label, id, type }) => {
  return (
    <div className="relative text-xs">
      <input
        id={id}
        name={id}
        type={type}
        placeholder=" "
        className="peer w-full rounded-xl border border-emerald-400/40 bg-slate-950/50 px-3 py-3 text-xs text-slate-50 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/80"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3 top-2.5 origin-left bg-slate-900/90 px-1 text-[11px] text-slate-400 transition-all duration-150 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-focus:-translate-y-2 peer-focus:scale-90 peer-focus:text-emerald-300"
      >
        {label}
      </label>
    </div>
  );
};

const FloatingTextarea = ({ label, id }) => {
  return (
    <div className="relative text-xs">
      <textarea
        id={id}
        name={id}
        rows={4}
        placeholder=" "
        className="peer w-full resize-none rounded-xl border border-emerald-400/40 bg-slate-950/50 px-3 py-3 text-xs text-slate-50 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/80"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3 top-2.5 origin-left bg-slate-900/90 px-1 text-[11px] text-slate-400 transition-all duration-150 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-focus:-translate-y-2 peer-focus:scale-90 peer-focus:text-emerald-300"
      >
        {label}
      </label>
    </div>
  );
};

export default ContactSection;
