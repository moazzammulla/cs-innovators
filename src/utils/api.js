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
  // Use data manager to get all posts for canteen
  const { getAllSurplusPosts } = await import('./surplusDataManager');
  const allPosts = getAllSurplusPosts();
  
  // If no posts, fallback to mock data
  if (allPosts.length === 0) {
    return canteenSurplusPosts;
  }
  
  // Transform to match expected format
  return allPosts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((post) => ({
      id: post.id,
      foodName: post.foodName,
      quantity: post.quantity,
      status: post.status === 'Available' ? 'Posted' : post.status,
      createdAt: new Date(post.createdAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
    }));
}

export async function fetchNgoNearbySurplus() {
  await delay(300);
  // Use data manager to get available surplus posts
  const { getAvailableSurplusPosts } = await import('./surplusDataManager');
  const availablePosts = getAvailableSurplusPosts();
  
  // If no posts from data manager, fallback to mock data
  if (availablePosts.length === 0) {
    return ngoNearbySurplus;
  }
  
  // Transform to match expected format
  return availablePosts.map((post) => ({
    id: post.id,
    foodName: post.foodName,
    quantity: post.quantity,
    canteen: post.canteen || 'Green Leaf Canteen',
    distance: post.distance || '1.2 km',
    deadline: post.deadline || 'Today, 8:30 PM',
    status: post.status,
  }));
}

export async function fetchAnalytics() {
  await delay(300);
  // Use data manager to get analytics from actual surplus posts
  const { getAnalyticsData } = await import('./surplusDataManager');
  const analyticsData = getAnalyticsData();
  
  // If no data, fallback to mock data
  if (analyticsData.weeklySurplusData.length === 0 && analyticsData.pickupHistory.length === 0) {
    return { weeklySurplusData, foodSavedData, pickupHistory };
  }
  
  return analyticsData;
}

export async function createSurplusPost(payload) {
  await delay(400);
  // Use data manager to create and save the post
  const { createSurplusPost: createPost } = await import('./surplusDataManager');
  const newPost = createPost({
    foodName: payload.foodName,
    quantity: payload.quantity,
    preparedTime: payload.preparedTime,
    vegType: payload.vegType,
    image: payload.image,
    safetyChecklist: payload.safetyChecklist,
  });
  return newPost;
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

