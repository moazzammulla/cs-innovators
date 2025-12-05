export const todaysPredictedSurplusKg = 48;

export const canteenSurplusPosts = [
  {
    id: 1,
    foodName: 'Veg Pulao',
    quantity: '25 portions',
    status: 'Posted',
    createdAt: 'Today, 12:30 PM',
  },
  {
    id: 2,
    foodName: 'Chapati & Curry',
    quantity: '40 portions',
    status: 'NGO Assigned',
    createdAt: 'Today, 1:00 PM',
  },
  {
    id: 3,
    foodName: 'Salad Bowls',
    quantity: '15 portions',
    status: 'Delivered',
    createdAt: 'Yesterday, 8:00 PM',
  },
];

export const weeklySurplusData = [
  { name: 'Mon', value: 32 },
  { name: 'Tue', value: 45 },
  { name: 'Wed', value: 28 },
  { name: 'Thu', value: 50 },
  { name: 'Fri', value: 40 },
  { name: 'Sat', value: 60 },
  { name: 'Sun', value: 35 },
];

export const foodSavedData = [
  { name: 'Saved', value: 72 },
  { name: 'Wasted', value: 28 },
];

export const ngoNearbySurplus = [
  {
    id: 1,
    canteen: 'Green Leaf Canteen',
    foodName: 'Dal & Rice',
    quantity: '30 portions',
    distance: '1.2 km',
    deadline: 'Today, 8:30 PM',
  },
  {
    id: 2,
    canteen: 'Campus Dining Hall',
    foodName: 'Veg Pasta',
    quantity: '20 portions',
    distance: '2.1 km',
    deadline: 'Today, 9:00 PM',
  },
  {
    id: 3,
    canteen: 'City Center Canteen',
    foodName: 'Mixed Thali',
    quantity: '35 portions',
    distance: '3.5 km',
    deadline: 'Today, 7:45 PM',
  },
];

export const pickupHistory = [
  {
    id: 101,
    date: '2025-12-01',
    foodName: 'Veg Pulao',
    ngo: 'HopeForAll',
    quantity: '20 portions',
    status: 'Delivered',
  },
  {
    id: 102,
    date: '2025-12-02',
    foodName: 'Chapati & Curry',
    ngo: 'HungerFree',
    quantity: '35 portions',
    status: 'Delivered',
  },
  {
    id: 103,
    date: '2025-12-03',
    foodName: 'Sandwiches',
    ngo: 'MealsOnWheels',
    quantity: '18 portions',
    status: 'Picked Up',
  },
];

export const trackingSteps = [
  'Posted',
  'NGO Assigned',
  'Picked Up',
  'Delivered',
];
