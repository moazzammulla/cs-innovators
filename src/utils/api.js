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

