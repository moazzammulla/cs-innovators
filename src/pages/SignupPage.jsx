import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  pickupCapacity: '',
};

const SignupPage = () => {
  const [role, setRole] = useState('canteen');
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name) nextErrors.name = 'Name is required';
    if (!form.email) nextErrors.email = 'Email is required';
    if (!form.phone) nextErrors.phone = 'Phone is required';
    if (!form.address) nextErrors.address = 'Address is required';
    if (!form.password) nextErrors.password = 'Password is required';
    if (role === 'ngo' && !form.pickupCapacity) {
      nextErrors.pickupCapacity = 'Pickup capacity is required for NGOs';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    toast.success(
      `${role === 'canteen' ? 'Canteen' : 'NGO'} account created (mock). You can log in now.`
    );
    setForm(initialForm);
  };

  return (
    <div className="mx-auto mt-8 max-w-xl rounded-2xl bg-white p-6 shadow-soft md:mt-16">
      <div className="mb-4 flex rounded-full bg-gray-100 p-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setRole('canteen')}
          className={`flex-1 rounded-full px-3 py-2 transition ${
            role === 'canteen' ? 'bg-white text-secondary shadow-sm' : 'text-gray-500'
          }`}
        >
          Canteen Signup
        </button>
        <button
          type="button"
          onClick={() => setRole('ngo')}
          className={`flex-1 rounded-full px-3 py-2 transition ${
            role === 'ngo' ? 'bg-white text-secondary shadow-sm' : 'text-gray-500'
          }`}
        >
          NGO Signup
        </button>
      </div>

      <h2 className="mb-1 text-lg font-semibold text-secondary">
        Create your {role === 'canteen' ? 'Canteen' : 'NGO'} account
      </h2>
      <p className="mb-4 text-xs text-gray-500">
        Join the network to share surplus meals and serve nearby communities.
      </p>

      <form onSubmit={handleSubmit} className="grid gap-3 text-sm md:grid-cols-2">
        <div className="md:col-span-2">
          <InputField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Organization name"
            error={errors.name}
          />
        </div>
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
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Contact number"
          error={errors.phone}
        />
        <div className="md:col-span-2">
          <InputField
            label="Address / Location"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address or location placeholder"
            error={errors.address}
          />
        </div>
        {role === 'ngo' && (
          <InputField
            label="Pickup Capacity (meals per trip)"
            name="pickupCapacity"
            value={form.pickupCapacity}
            onChange={handleChange}
            placeholder="e.g., 100 meals"
            error={errors.pickupCapacity}
          />
        )}
        <InputField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.password}
        />
        <div className="md:col-span-2">
          <Button type="submit" className="mt-2 w-full">
            Sign Up
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
