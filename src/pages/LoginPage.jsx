import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import GoogleAuthButton from '../components/ui/GoogleAuthButton';

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
    <div className="mx-auto mt-8 flex max-w-md flex-col rounded-2xl bg-white p-6 shadow-soft md:mt-16">
      <div className="mb-4 flex rounded-full bg-gray-100 p-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setRole('canteen')}
          className={`flex-1 rounded-full px-3 py-2 transition ${
            role === 'canteen' ? 'bg-white text-secondary shadow-sm' : 'text-gray-500'
          }`}
        >
          Canteen Login
        </button>
        <button
          type="button"
          onClick={() => setRole('ngo')}
          className={`flex-1 rounded-full px-3 py-2 transition ${
            role === 'ngo' ? 'bg-white text-secondary shadow-sm' : 'text-gray-500'
          }`}
        >
          NGO Login
        </button>
      </div>
      <h2 className="mb-1 text-lg font-semibold text-secondary">
        Welcome back, {role === 'canteen' ? 'Canteen' : 'NGO'} partner
      </h2>
      <p className="mb-4 text-xs text-gray-500">
        Log in to manage surplus, accept pickups, and view live analytics.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
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
        <Button type="submit" className="mt-2 w-full">
          Login
        </Button>
      </form>
      <div className="my-4 flex items-center gap-2 text-[11px] text-gray-400">
        <div className="h-px flex-1 bg-gray-200" />
        <span>or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>
      <GoogleAuthButton
        onClick={() => toast.success('Google login coming soon (mock)')}
      />
      <p className="mt-4 text-center text-[11px] text-gray-500">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/signup')}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Create an account
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
