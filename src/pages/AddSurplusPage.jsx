import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import { createSurplusPost } from '../utils/api';

const initialForm = {
  foodName: '',
  quantity: '',
  preparedTime: '',
  vegType: 'veg',
  image: '',
  safetyChecklist: {
    storedProperly: false,
    withinSafeTime: false,
    labelled: false,
  },
};

const AddSurplusPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      safetyChecklist: { ...prev.safetyChecklist, [name]: checked },
    }));
  };

  const handleVegToggle = (value) => {
    setForm((prev) => ({ ...prev, vegType: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.foodName) nextErrors.foodName = 'Food name is required';
    if (!form.quantity) nextErrors.quantity = 'Quantity is required';
    if (!form.preparedTime) nextErrors.preparedTime = 'Prepared time is required';
    const checklistValues = Object.values(form.safetyChecklist);
    if (!checklistValues.every(Boolean)) {
      nextErrors.safety = 'All safety checks must be confirmed';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const newPost = await createSurplusPost(form);
      toast.success(`Surplus food post created! ${newPost.foodName} is now available for NGOs.`);
      setForm(initialForm);
      // Redirect to canteen dashboard after a short delay
      setTimeout(() => {
        navigate('/canteen/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error creating surplus post:', error);
      toast.error('Failed to create surplus post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-secondary">Add Surplus Food</h1>
        <p className="text-xs text-gray-500">
          Log surplus meals with safety checks so NGOs can pick them up on time.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4 text-sm">
        <InputField
          label="Food Name"
          name="foodName"
          value={form.foodName}
          onChange={handleChange}
          placeholder="e.g., Veg Biryani"
          error={errors.foodName}
        />
        <div className="grid gap-3 md:grid-cols-2">
          <InputField
            label="Quantity"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="e.g., 40 portions or 10 kg"
            error={errors.quantity}
          />
          <InputField
            label="Prepared Time"
            name="preparedTime"
            value={form.preparedTime}
            onChange={handleChange}
            placeholder="e.g., Today 1:00 PM"
            error={errors.preparedTime}
          />
        </div>

        <div className="space-y-1 text-xs">
          <p className="text-xs font-medium text-gray-700">Veg / Non-Veg</p>
          <div className="inline-flex rounded-full bg-gray-100 p-1 text-[11px] font-medium">
            <button
              type="button"
              onClick={() => handleVegToggle('veg')}
              className={`flex-1 rounded-full px-3 py-1.5 transition ${
                form.vegType === 'veg'
                  ? 'bg-white text-secondary shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Veg
            </button>
            <button
              type="button"
              onClick={() => handleVegToggle('non-veg')}
              className={`flex-1 rounded-full px-3 py-1.5 transition ${
                form.vegType === 'non-veg'
                  ? 'bg-white text-secondary shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Non-Veg
            </button>
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <p className="text-xs font-medium text-gray-700">Upload Image (placeholder)</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm((prev) => ({ ...prev, image: e.target.files?.[0]?.name || '' }))
            }
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-sm"
          />
          {form.image && (
            <p className="text-[11px] text-gray-500">Selected: {form.image}</p>
          )}
        </div>

        <div className="space-y-2 text-xs">
          <p className="text-xs font-medium text-gray-700">Safety Checklist</p>
          <div className="grid gap-2 md:grid-cols-2">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                name="storedProperly"
                checked={form.safetyChecklist.storedProperly}
                onChange={handleCheckboxChange}
                className="mt-0.5 h-3 w-3 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-[11px] text-gray-600">
                Food is stored in clean containers at safe temperature.
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                name="withinSafeTime"
                checked={form.safetyChecklist.withinSafeTime}
                onChange={handleCheckboxChange}
                className="mt-0.5 h-3 w-3 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-[11px] text-gray-600">
                Food is within safe consumption time window.
              </span>
            </label>
            <label className="flex items-start gap-2 md:col-span-2">
              <input
                type="checkbox"
                name="labelled"
                checked={form.safetyChecklist.labelled}
                onChange={handleCheckboxChange}
                className="mt-0.5 h-3 w-3 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-[11px] text-gray-600">
                Containers are labelled with preparation time and contents.
              </span>
            </label>
          </div>
          {errors.safety && <p className="text-[11px] text-red-500">{errors.safety}</p>}
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Surplus'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddSurplusPage;
