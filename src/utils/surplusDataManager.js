/**
 * Surplus Data Manager
 * Manages surplus posts and pickups using localStorage
 * This simulates a backend database for the demo
 */

const STORAGE_KEYS = {
  SURPLUS_POSTS: 'surplus_posts',
  PICKUPS: 'pickups',
};

/**
 * Get all surplus posts
 * @returns {Array} Array of surplus posts
 */
export function getAllSurplusPosts() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SURPLUS_POSTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading surplus posts:', error);
    return [];
  }
}

/**
 * Get available surplus posts (status: 'Available')
 * @returns {Array} Array of available surplus posts
 */
export function getAvailableSurplusPosts() {
  const allPosts = getAllSurplusPosts();
  return allPosts.filter((post) => post.status === 'Available');
}

/**
 * Create a new surplus post
 * @param {Object} postData - Surplus post data
 * @returns {Object} Created post with ID and timestamps
 */
export function createSurplusPost(postData) {
  const posts = getAllSurplusPosts();
  const newPost = {
    id: Date.now(),
    ...postData,
    status: 'Available',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    canteen: 'Green Leaf Canteen', // Default canteen name
    distance: `${(Math.random() * 5 + 0.5).toFixed(1)} km`, // Random distance for demo
    deadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }), // 4 hours from now
  };
  posts.push(newPost);
  localStorage.setItem(STORAGE_KEYS.SURPLUS_POSTS, JSON.stringify(posts));
  return newPost;
}

/**
 * Update surplus post status
 * @param {number} postId - Post ID
 * @param {string} status - New status
 * @returns {Object|null} Updated post or null
 */
export function updateSurplusPostStatus(postId, status) {
  const posts = getAllSurplusPosts();
  const postIndex = posts.findIndex((p) => p.id === postId);
  if (postIndex === -1) return null;

  posts[postIndex].status = status;
  posts[postIndex].updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.SURPLUS_POSTS, JSON.stringify(posts));
  return posts[postIndex];
}

/**
 * Get all pickups
 * @returns {Array} Array of pickup records
 */
export function getAllPickups() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PICKUPS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading pickups:', error);
    return [];
  }
}

/**
 * Get active pickups (not delivered)
 * @returns {Array} Array of active pickup records
 */
export function getActivePickups() {
  const allPickups = getAllPickups();
  return allPickups.filter((pickup) => pickup.status !== 'Delivered');
}

/**
 * Create a new pickup record
 * @param {Object} pickupData - Pickup data
 * @returns {Object} Created pickup with ID and timeline
 */
export function createPickup(pickupData) {
  const pickups = getAllPickups();
  const surplusPost = getAllSurplusPosts().find((p) => p.id === pickupData.surplusId);
  
  if (!surplusPost) {
    throw new Error('Surplus post not found');
  }

  const newPickup = {
    id: Date.now(),
    surplusId: pickupData.surplusId,
    ngoId: pickupData.ngoId || 1, // Default NGO ID
    ngoName: pickupData.ngoName || 'HopeForAll',
    foodName: surplusPost.foodName,
    quantity: surplusPost.quantity,
    canteen: surplusPost.canteen,
    status: 'NGO Assigned',
    statusTimeline: [
      {
        status: 'Posted',
        at: surplusPost.createdAt,
        description: `Posted by ${surplusPost.canteen}`,
      },
      {
        status: 'NGO Assigned',
        at: new Date().toISOString(),
        description: `Assigned to ${pickupData.ngoName || 'HopeForAll'}`,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  pickups.push(newPickup);
  localStorage.setItem(STORAGE_KEYS.PICKUPS, JSON.stringify(pickups));

  // Update surplus post status
  updateSurplusPostStatus(pickupData.surplusId, 'NGO Assigned');

  return newPickup;
}

/**
 * Update pickup status
 * @param {number} pickupId - Pickup ID
 * @param {string} status - New status
 * @returns {Object|null} Updated pickup or null
 */
export function updatePickupStatus(pickupId, status) {
  const pickups = getAllPickups();
  const pickupIndex = pickups.findIndex((p) => p.id === pickupId);
  if (pickupIndex === -1) return null;

  const pickup = pickups[pickupIndex];
  pickup.status = status;
  pickup.updatedAt = new Date().toISOString();

  // Add to timeline
  pickup.statusTimeline = pickup.statusTimeline || [];
  pickup.statusTimeline.push({
    status: status,
    at: new Date().toISOString(),
    description: getStatusDescription(status),
  });

  localStorage.setItem(STORAGE_KEYS.PICKUPS, JSON.stringify(pickups));

  // Update surplus post status if needed
  if (status === 'Picked Up') {
    updateSurplusPostStatus(pickup.surplusId, 'Picked Up');
  } else if (status === 'Delivered') {
    updateSurplusPostStatus(pickup.surplusId, 'Delivered');
  }

  return pickup;
}

/**
 * Get status description for timeline
 * @param {string} status - Status name
 * @returns {string} Description
 */
function getStatusDescription(status) {
  const descriptions = {
    'Posted': 'Surplus food posted by canteen',
    'NGO Assigned': 'NGO accepted the pickup',
    'Picked Up': 'Food picked up from canteen',
    'Delivered': 'Food delivered to beneficiaries',
  };
  return descriptions[status] || status;
}

/**
 * Get pickup by ID
 * @param {number} pickupId - Pickup ID
 * @returns {Object|null} Pickup record or null
 */
export function getPickupById(pickupId) {
  const pickups = getAllPickups();
  return pickups.find((p) => p.id === pickupId) || null;
}

/**
 * Get analytics data from surplus posts and pickups
 * @returns {Object} Analytics data including weekly surplus, food saved/wasted, and pickup history
 */
export function getAnalyticsData() {
  const allPosts = getAllSurplusPosts();
  const allPickups = getAllPickups();

  // Calculate weekly surplus data (last 7 days)
  const weeklySurplus = calculateWeeklySurplus(allPosts);
  
  // Calculate food saved vs wasted
  const foodSaved = calculateFoodSavedWasted(allPickups);
  
  // Get pickup history
  const pickupHistory = getPickupHistory(allPickups);

  return {
    weeklySurplusData: weeklySurplus,
    foodSavedData: foodSaved,
    pickupHistory,
  };
}

/**
 * Calculate weekly surplus data from posts
 * @param {Array} posts - All surplus posts
 * @returns {Array} Weekly data array
 */
function calculateWeeklySurplus(posts) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyData = days.map((day) => ({ name: day, value: 0 }));

  // Get posts from last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentPosts = posts.filter((post) => {
    const postDate = new Date(post.createdAt);
    return postDate >= sevenDaysAgo;
  });

  // Group by day of week
  recentPosts.forEach((post) => {
    const postDate = new Date(post.createdAt);
    const dayIndex = postDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    // Convert to our format: 0 = Monday
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    
    // Extract quantity number (e.g., "25 portions" -> 25)
    const quantityMatch = post.quantity?.match(/(\d+)/);
    const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 0;
    
    // Convert portions to kg (rough estimate: 1 portion ≈ 0.2 kg)
    const kg = quantity * 0.2;
    
    if (weeklyData[adjustedIndex]) {
      weeklyData[adjustedIndex].value += Math.round(kg);
    }
  });

  return weeklyData;
}

/**
 * Calculate food saved vs wasted
 * @param {Array} pickups - All pickup records
 * @returns {Array} Food saved/wasted data
 */
function calculateFoodSavedWasted(pickups) {
  const delivered = pickups.filter((p) => p.status === 'Delivered').length;
  const total = pickups.length;
  const wasted = total - delivered;

  return [
    { name: 'Saved', value: delivered },
    { name: 'Wasted', value: wasted },
  ];
}

/**
 * Get pickup history for analytics
 * @param {Array} pickups - All pickup records
 * @returns {Array} Formatted pickup history
 */
function getPickupHistory(pickups) {
  return pickups
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10) // Last 10 pickups
    .map((pickup) => ({
      id: pickup.id,
      date: new Date(pickup.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      foodName: pickup.foodName,
      ngo: pickup.ngoName || 'N/A',
      quantity: pickup.quantity,
      status: pickup.status,
    }));
}

