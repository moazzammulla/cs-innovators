import React, { useState, useEffect, useRef } from 'react';
import { getCanteenProfile, updateCanteenProfile, getAvatarLetter } from '../../utils/profileManager';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const CanteenProfile = () => {
  const [profile, setProfile] = useState(getCanteenProfile());
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Load profile on mount
    setProfile(getCanteenProfile());
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsEditing(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleEdit = () => {
    setEditForm(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    try {
      const updated = updateCanteenProfile(editForm);
      setProfile(updated);
      setEditForm(updated);
      setIsEditing(false);
      setIsOpen(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const avatarLetter = getAvatarLetter(profile.email);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
          {avatarLetter}
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-secondary">{profile.canteenName}</p>
          <p className="text-[11px] text-gray-500">{profile.location}</p>
        </div>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg">
          {!isEditing ? (
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-base font-semibold text-white">
                  {avatarLetter}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-secondary">{profile.canteenName}</p>
                  <p className="text-[11px] text-gray-500">{profile.email}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <p className="text-[11px] font-medium text-gray-500 mb-0.5">Location</p>
                  <p className="text-sm text-gray-700">{profile.location}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-gray-500 mb-0.5">Contact Number</p>
                  <p className="text-sm text-gray-700">{profile.contactNumber}</p>
                </div>
              </div>

              <Button onClick={handleEdit} size="sm" className="w-full">
                Edit Profile
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-base font-semibold text-white">
                  {avatarLetter}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-secondary">Edit Profile</p>
                  <p className="text-[11px] text-gray-500">{profile.email}</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <InputField
                  label="Canteen Name"
                  name="canteenName"
                  value={editForm.canteenName}
                  onChange={(e) => setEditForm({ ...editForm, canteenName: e.target.value })}
                  placeholder="Enter canteen name"
                />
                <InputField
                  label="Location"
                  name="location"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  placeholder="Enter location"
                />
                <InputField
                  label="Contact Number"
                  name="contactNumber"
                  value={editForm.contactNumber}
                  onChange={(e) => setEditForm({ ...editForm, contactNumber: e.target.value })}
                  placeholder="Enter contact number"
                />
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleCancel} variant="ghost" size="sm" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSave} size="sm" className="flex-1">
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CanteenProfile;

