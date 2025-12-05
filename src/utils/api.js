import {
  todaysPredictedSurplusKg,
  canteenSurplusPosts,
  ngoNearbySurplus,
  weeklySurplusData,
  foodSavedData,
  pickupHistory,
} from './mockData';

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchTodaysSurplus() {
  await delay(300);
  return todaysPredictedSurplusKg;
}

export async function fetchCanteenSurplusPosts() {
  await delay(300);
  return canteenSurplusPosts;
}

export async function fetchNgoNearbySurplus() {
  await delay(300);
  return ngoNearbySurplus;
}

export async function fetchAnalytics() {
  await delay(300);
  return { weeklySurplusData, foodSavedData, pickupHistory };
}

export async function createSurplusPost(payload) {
  await delay(400);
  // Normally you would POST to backend; we just echo the payload.
  return { id: Date.now(), ...payload };
}

// Base URL for Mockoon API (update this to your Mockoon server URL)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Fetch NGOs by pincode
 * @param {string} pincode - Pincode to search for NGOs
 * @returns {Promise<Array>} Array of NGO objects
 */
export async function fetchNgosByPincode(pincode) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ngos?pincode=${pincode}`);
    if (!response.ok) {
      throw new Error('Failed to fetch NGOs');
    }
    const data = await response.json();
    return data.ngos || [];
  } catch (error) {
    console.error('Error fetching NGOs by pincode:', error);
    // Fallback to mock data if API fails
    await delay(300);
    return getMockNgosByPincode(pincode);
  }
}

/**
 * Mock data fallback for NGOs by pincode
 * @param {string} pincode - Pincode
 * @returns {Array} Mock NGO data
 */
function getMockNgosByPincode(pincode) {
  // Mock data - replace with actual API call
  const mockNgos = [
    {
      id: 1,
      name: 'HopeForAll Foundation',
      pincode: '560001',
      address: '123 Main Street, Bangalore',
      contactPerson: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'contact@hopeforall.org',
      distance: '1.2 km',
      capacity: '50 kg/day',
      specialties: ['Food Distribution', 'Community Meals'],
    },
    {
      id: 2,
      name: 'HungerFree India',
      pincode: '560001',
      address: '456 Park Avenue, Bangalore',
      contactPerson: 'Priya Sharma',
      phone: '+91 98765 43211',
      email: 'info@hungerfree.in',
      distance: '2.5 km',
      capacity: '75 kg/day',
      specialties: ['Emergency Food', 'Daily Meals'],
    },
    {
      id: 3,
      name: 'MealsOnWheels NGO',
      pincode: '560001',
      address: '789 MG Road, Bangalore',
      contactPerson: 'Amit Patel',
      phone: '+91 98765 43212',
      email: 'contact@mealsonwheels.org',
      distance: '3.1 km',
      capacity: '100 kg/day',
      specialties: ['Mobile Distribution', 'Senior Care'],
    },
  ];
  
  // Filter by pincode (in real scenario, this would be done by API)
  return mockNgos.filter(ngo => ngo.pincode === pincode || !pincode);
}

