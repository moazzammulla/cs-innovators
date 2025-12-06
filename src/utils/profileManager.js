/**
 * Profile Manager
 * Manages canteen and NGO profile data using localStorage
 */

const STORAGE_KEYS = {
  canteen: 'canteen_profile',
  ngo: 'ngo_profile',
};

/**
 * Get canteen profile
 * @param {string} email - Optional email to use if profile doesn't exist
 * @returns {Object} Profile data
 */
export function getCanteenProfile(email = null) {
  return getProfile('canteen', email, {
    email: email || 'canteen@example.com',
    canteenName: 'Green Leaf Canteen',
    location: 'Bangalore, Karnataka',
    contactNumber: '+91 98765 43210',
  });
}

/**
 * Get NGO profile
 * @param {string} email - Optional email to use if profile doesn't exist
 * @returns {Object} Profile data
 */
export function getNgoProfile(email = null) {
  return getProfile('ngo', email, {
    email: email || 'ngo@example.com',
    ngoName: 'HopeForAll Foundation',
    location: 'Bangalore, Karnataka',
    contactNumber: '+91 98765 43210',
  });
}

/**
 * Get profile for a specific role
 * @param {string} role - 'canteen' or 'ngo'
 * @param {string} email - Optional email to use if profile doesn't exist
 * @param {Object} defaultProfile - Default profile data
 * @returns {Object} Profile data
 */
function getProfile(role, email = null, defaultProfile) {
  const storageKey = STORAGE_KEYS[role];
  if (!storageKey) {
    throw new Error(`Invalid role: ${role}`);
  }

  try {
    const data = localStorage.getItem(storageKey);
    if (data) {
      const profile = JSON.parse(data);
      // Update email if provided and different
      if (email && email !== profile.email) {
        const updated = { ...profile, email };
        localStorage.setItem(storageKey, JSON.stringify(updated));
        return updated;
      }
      return profile;
    }
  } catch (error) {
    console.error(`Error reading ${role} profile:`, error);
  }
  
  // Default profile
  const profile = {
    ...defaultProfile,
    email: email || defaultProfile.email,
  };
  
  // Save default profile if email is provided
  if (email) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(profile));
    } catch (error) {
      console.error(`Error saving default ${role} profile:`, error);
    }
  }
  
  return profile;
}

/**
 * Update canteen profile
 * @param {Object} profileData - Profile data to update
 * @returns {Object} Updated profile
 */
export function updateCanteenProfile(profileData) {
  return updateProfile('canteen', profileData);
}

/**
 * Update NGO profile
 * @param {Object} profileData - Profile data to update
 * @returns {Object} Updated profile
 */
export function updateNgoProfile(profileData) {
  return updateProfile('ngo', profileData);
}

/**
 * Update profile for a specific role
 * @param {string} role - 'canteen' or 'ngo'
 * @param {Object} profileData - Profile data to update
 * @returns {Object} Updated profile
 */
function updateProfile(role, profileData) {
  const storageKey = STORAGE_KEYS[role];
  if (!storageKey) {
    throw new Error(`Invalid role: ${role}`);
  }

  const getProfileFn = role === 'canteen' ? getCanteenProfile : getNgoProfile;
  const currentProfile = getProfileFn();
  const updatedProfile = {
    ...currentProfile,
    ...profileData,
    updatedAt: new Date().toISOString(),
  };
  
  try {
    localStorage.setItem(storageKey, JSON.stringify(updatedProfile));
    return updatedProfile;
  } catch (error) {
    console.error(`Error saving ${role} profile:`, error);
    throw error;
  }
}

/**
 * Get avatar letter from email
 * @param {string} email - Email address
 * @returns {string} First letter (uppercase)
 */
export function getAvatarLetter(email) {
  if (!email) return 'C';
  return email.charAt(0).toUpperCase();
}

