import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import GoogleAuthButton from '../components/ui/GoogleAuthButton';
import { fadeInUp } from '../utils/motionPresets';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const initialRole = urlParams.get('role') === 'ngo' ? 'ngo' : 'canteen';

  const [role, setRole] = useState(initialRole);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.email) nextErrors.email = 'Email is required';
    if (!form.password) nextErrors.password = 'Password is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Save email to profile based on role
    if (form.email) {
      try {
        const { getCanteenProfile, getNgoProfile } = await import('../utils/profileManager');
        if (role === 'canteen') {
          getCanteenProfile(form.email); // This will update the email in profile
        } else {
          getNgoProfile(form.email); // This will update the email in profile
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
    
    toast.success(`Logged in as ${role === 'canteen' ? 'Canteen' : 'NGO'}`);
    navigate(role === 'canteen' ? '/canteen/dashboard' : '/ngo/dashboard');
  };

  return (
    <motion.div
      className="mx-auto mt-8 flex max-w-md flex-col md:mt-16"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <div className="glass-card group relative overflow-hidden rounded-3xl border border-emerald-400/30 p-8 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        
        <div className="relative z-10">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-400/40 mb-3">
              <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
              AI Food Waste Minimizer
            </div>
            <h2 className="bg-gradient-to-r from-emerald-300 via-lime-200 to-cyan-300 bg-clip-text text-2xl font-semibold text-transparent md:text-3xl">
              Welcome back, {role === 'canteen' ? 'Canteen' : 'NGO'} partner
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              Log in to manage surplus, accept pickups, and view live analytics.
            </p>
          </div>

          <div className="mb-6 flex rounded-full bg-slate-900/60 p-1 text-xs font-medium ring-1 ring-emerald-400/20">
            <motion.button
              type="button"
              onClick={() => setRole('canteen')}
              className={`flex-1 rounded-full px-4 py-2.5 transition-all ${
                role === 'canteen'
                  ? 'bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/30'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Canteen Login
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setRole('ngo')}
              className={`flex-1 rounded-full px-4 py-2.5 transition-all ${
                role === 'ngo'
                  ? 'bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/30'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              NGO Login
            </motion.button>
          </div>
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <InputField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
            />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="mt-2 w-full bg-emerald-500 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:bg-emerald-400"
              >
                Login
              </Button>
            </motion.div>
          </motion.form>

          <div className="my-6 flex items-center gap-3 text-[11px]">
            <div className="h-px flex-1 bg-emerald-400/20" />
            <span className="text-gray-400">or</span>
            <div className="h-px flex-1 bg-emerald-400/20" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GoogleAuthButton
              onClick={() => toast.success('Google login coming soon (mock)')}
            />
          </motion.div>

          <motion.p
            className="mt-6 text-center text-[11px] text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="font-medium text-emerald-300 underline-offset-2 hover:text-emerald-200 hover:underline transition-colors"
            >
              Create an account
            </button>
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
