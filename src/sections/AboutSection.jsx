import React from 'react';
import { motion } from 'framer-motion';
import { fadeInLeft, fadeInRight, staggerContainer } from '../utils/motionPresets';

const aboutItems = [
  {
    title: 'AI Prediction',
    description:
      'Our models forecast surplus meals hours before service ends, so logistics can respond early.',
    icon: '⚙️',
  },
  {
    title: 'NGO Matching',
    description:
      'We route surplus to the closest NGOs with the right capacity, fleet and timing windows.',
    icon: '🤝',
  },
  {
    title: 'Impact Analytics',
    description:
      'Visualize meals saved, CO₂ avoided and communities served in one unified dashboard.',
    icon: '📊',
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="relative mt-24 scroll-mt-24">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)] md:items-center">
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="space-y-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">
            About the Platform
          </p>
          <h2 className="text-2xl font-semibold text-slate-50 md:text-3xl">
            Designed for canteens and NGOs on a mission to end food waste.
          </h2>
          <p className="text-sm text-slate-300/80">
            AI Food Waste Minimizer sits between your canteen operations and NGO partners, learning
            from your daily patterns to make every surplus pickup smarter, faster, and safer.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-4 text-sm"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {aboutItems.map((item, idx) => (
            <motion.div
              key={item.title}
              variants={fadeInRight}
              className="glass-card flex items-start gap-3 rounded-2xl p-4"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-lg">
                <span>{item.icon}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-50">{item.title}</p>
                <p className="mt-1 text-xs text-slate-300/80">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
