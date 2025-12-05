import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from './ui/Button';

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'features', label: 'Features' },
  { id: 'ngo-signup', label: 'NGO Signup' },
  { id: 'contact', label: 'Contact' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = React.useState('hero');

  React.useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      const scrollY = window.scrollY + 140; // offset for sticky header
      let current = 'hero';
      SECTIONS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.offsetTop;
        if (scrollY >= top) current = id;
      });
      setActive(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      // Slight delay to ensure landing page is rendered
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
    <header className="fixed inset-x-0 top-0 z-20 bg-slate-950/80 shadow-soft backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <button
          type="button"
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-slate-950">
            <span className="text-sm font-bold">AI</span>
          </div>
          <span className="text-sm font-semibold text-emerald-100 md:text-base">
            Food Waste Minimizer
          </span>
        </button>
        <nav className="hidden items-center gap-5 text-xs font-medium text-slate-300 md:flex">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToSection(s.id)}
              className={`relative pb-1 transition-colors ${
                active === s.id ? 'text-emerald-300' : 'text-slate-300 hover:text-emerald-200'
              }`}
            >
              {s.label}
              {active === s.id && (
                <span className="absolute inset-x-0 -bottom-0.5 h-px bg-gradient-to-r from-emerald-400/0 via-emerald-400 to-emerald-400/0" />
              )}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/login')}
            className="hidden text-emerald-100 hover:bg-emerald-500/10 md:inline-flex"
          >
            Login
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/signup')}
            className="bg-emerald-500 text-slate-950 hover:bg-emerald-400"
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
