import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="relative border-t border-emerald-500/20 bg-slate-950/90 py-4 text-xs text-slate-400">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-slate-900 via-slate-950/90 to-transparent" />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 md:flex-row md:px-6">
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
          <button
            type="button"
            onClick={() => scrollTo('about')}
            className="hover:text-emerald-300"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => scrollTo('contact')}
            className="hover:text-emerald-300"
          >
            Contact
          </button>
          <button
            type="button"
            onClick={() => scrollTo('ngo-signup')}
            className="hover:text-emerald-300"
          >
            NGO Signup
          </button>
          <button
            type="button"
            onClick={() => scrollTo('privacy')}
            className="hover:text-emerald-300"
          >
            Privacy
          </button>
          <button
            type="button"
            onClick={() => scrollTo('terms')}
            className="hover:text-emerald-300"
          >
            Terms
          </button>
        </div>
        <p className="text-[11px] text-slate-500">
          © {new Date().getFullYear()} AI Food Waste Minimizer. All rights reserved.
        </p>
      </div>

      {/* Legal anchors to support smooth scroll */}
      <div className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 px-4 pb-1 text-[10px] text-slate-500 md:px-6">
        <div id="privacy" className="opacity-80">
          <span className="font-semibold text-slate-400">Privacy:</span> This is a demo UI.
          Replace with your organization&apos;s real privacy policy.
        </div>
        <div id="terms" className="opacity-80">
          <span className="font-semibold text-slate-400">Terms:</span> Prototype only. No real
          data is stored.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
