/**
 * Example usage of AI Service functions
 * This file demonstrates how to use the AI service in your components
 */

import {
  predictSurplusFood,
  getNgoPickupRecommendations,
  getAnalyticsInsights,
  getFoodSafetyRecommendations,
  isAIServiceAvailable,
} from './aiService';

// Example 1: Canteen Dashboard - Predict Surplus
export async function examplePredictSurplus() {
  if (!isAIServiceAvailable()) {
    console.warn('AI service not available. Please configure VITE_GEMINI_API_KEY');
    return null;
  }

  try {
    const prediction = await predictSurplusFood({
      historicalAverage: 25,
      dayOfWeek: 'Monday',
      weather: 'Sunny',
      expectedAttendance: 150,
      recentSurplus: [20, 25, 30, 28, 22],
    });

    console.log('AI Prediction:', prediction);
    // Output: { predictedQuantity: 26, reasoning: "...", confidence: "medium" }
    return prediction;
  } catch (error) {
    console.error('Error getting prediction:', error);
    return null;
  }
}

// Example 2: NGO Dashboard - Get Pickup Recommendations
export async function exampleGetNgoRecommendations() {
  if (!isAIServiceAvailable()) {
    console.warn('AI service not available');
    return null;
  }

  try {
    const recommendations = await getNgoPickupRecommendations({
      availableSurplus: [
        { id: 1, foodName: 'Veg Biryani', quantity: '30 portions', distance: '2 km', deadline: '6:00 PM' },
        { id: 2, foodName: 'Dal Rice', quantity: '25 portions', distance: '5 km', deadline: '7:00 PM' },
        { id: 3, foodName: 'Curry', quantity: '20 portions', distance: '1 km', deadline: '5:30 PM' },
      ],
      ngoLocation: 'City Center',
      ngoCapacity: 50,
      pastPickups: [
        { date: '2024-01-15', quantity: 45, success: true },
        { date: '2024-01-14', quantity: 30, success: true },
      ],
    });

    console.log('AI Recommendations:', recommendations);
    return recommendations;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return null;
  }
}

// Example 3: Analytics Insights
export async function exampleGetAnalyticsInsights(role = 'canteen') {
  if (!isAIServiceAvailable()) {
    return null;
  }

  try {
    const insights = await getAnalyticsInsights({
      role,
      weeklyData: [
        { name: 'Mon', value: 25 },
        { name: 'Tue', value: 30 },
        { name: 'Wed', value: 28 },
        { name: 'Thu', value: 32 },
        { name: 'Fri', value: 35 },
      ],
      pickupHistory: [
        { date: '2024-01-15', foodName: 'Biryani', quantity: '30 portions', status: 'Delivered' },
        { date: '2024-01-14', foodName: 'Dal Rice', quantity: '25 portions', status: 'Delivered' },
      ],
    });

    console.log('AI Insights:', insights);
    return insights;
  } catch (error) {
    console.error('Error getting insights:', error);
    return null;
  }
}

// Example 4: Food Safety Recommendations
export async function exampleGetSafetyRecommendations() {
  if (!isAIServiceAvailable()) {
    return null;
  }

  try {
    const safety = await getFoodSafetyRecommendations({
      foodName: 'Veg Biryani',
      preparedTime: 'Today 1:00 PM',
      vegType: 'veg',
      quantity: '40 portions',
    });

    console.log('Safety Recommendations:', safety);
    return safety;
  } catch (error) {
    console.error('Error getting safety recommendations:', error);
    return null;
  }
}
