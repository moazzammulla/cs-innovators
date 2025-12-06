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
  try {
    const response = await fetch(`${API_BASE_URL}/api/surplus-posts?canteenId=1`);
    if (!response.ok) {
      throw new Error('Failed to fetch surplus posts');
    }
    const result = await response.json();
    
    if (result.success && result.data) {
      // Transform to match expected format
      return result.data
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
    return [];
  } catch (error) {
    console.error('Error fetching surplus posts from API:', error);
    // Fallback to localStorage
    await delay(300);
    const { getAllSurplusPosts } = await import('./surplusDataManager');
    const allPosts = getAllSurplusPosts();
    
    if (allPosts.length === 0) {
      return canteenSurplusPosts;
    }
    
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
}

export async function fetchNgoNearbySurplus() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/surplus-posts/available`);
    if (!response.ok) {
      throw new Error('Failed to fetch available surplus posts');
    }
    const result = await response.json();
    
    if (result.success && result.data) {
      // Transform to match expected format
      return result.data.map((post) => ({
        id: post.id,
        foodName: post.foodName,
        quantity: post.quantity,
        canteen: post.canteen || 'Green Leaf Canteen',
        distance: post.distance || '1.2 km',
        deadline: post.deadline || 'Today, 8:30 PM',
        status: post.status,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching available surplus posts from API:', error);
    // Fallback to localStorage
    await delay(300);
    const { getAvailableSurplusPosts } = await import('./surplusDataManager');
    const availablePosts = getAvailableSurplusPosts();
    
    if (availablePosts.length === 0) {
      return ngoNearbySurplus;
    }
    
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
  // Convert preparedTime to ISO format if it's a simple string
  let preparedTimeISO = payload.preparedTime;
  if (payload.preparedTime && !payload.preparedTime.includes('T') && !payload.preparedTime.includes('Z')) {
    // If it's not already in ISO format, use current time as fallback
    // In a real app, you'd parse the user input, but for now we'll use current time
    preparedTimeISO = new Date().toISOString();
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/surplus-posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        foodName: payload.foodName,
        quantity: payload.quantity,
        preparedTime: preparedTimeISO,
        vegType: payload.vegType,
        image: payload.image || '',
        safetyChecklist: payload.safetyChecklist,
        canteenId: 1, // Default canteen ID
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create surplus post: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success && result.data) {
      return result.data;
    }
    
    throw new Error('Invalid response from API');
  } catch (error) {
    console.error('Error creating surplus post via API:', error);
    console.log('Falling back to localStorage...');
    // Fallback to localStorage (use local function to avoid recursion)
    await delay(400);
    const { createSurplusPostLocal } = await import('./surplusDataManager');
    const newPost = createSurplusPostLocal({
      foodName: payload.foodName,
      quantity: payload.quantity,
      preparedTime: payload.preparedTime,
      vegType: payload.vegType,
      image: payload.image,
      safetyChecklist: payload.safetyChecklist,
    });
    return newPost;
  }
}

// Base URL for Mockoon API (update this to your Mockoon server URL)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Update surplus post status via API
 * @param {number} postId - Post ID
 * @param {string} status - New status
 * @returns {Promise<Object|null>} Updated post or null
 */
export async function updateSurplusPostStatus(postId, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/surplus-posts/${postId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Post not found
      }
      throw new Error('Failed to update surplus post status');
    }
    
    const result = await response.json();
    
    if (result.success && result.data) {
      return result.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error updating surplus post status via API:', error);
    console.log('Falling back to localStorage...');
    // Fallback to localStorage (use local function to avoid recursion)
    const { updateSurplusPostStatusLocal } = await import('./surplusDataManager');
    return updateSurplusPostStatusLocal(postId, status);
  }
}

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

