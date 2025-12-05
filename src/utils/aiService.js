import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with API key from environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

// Use gemini-1.5-flash as it's the only model supported in free tier API keys
const DEFAULT_MODEL = 'gemini-2.0-flash';

/**
 * Get the Gemini model instance
 * Uses gemini-1.5-flash (free tier compatible)
 * @param {string} modelName - Model name (defaults to gemini-1.5-flash)
 * @returns {GenerativeModel} Model instance
 */
function getModel(modelName = DEFAULT_MODEL) {
  if (!API_KEY) {
    console.warn('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file');
    return null;
  }

  // Always use gemini-1.5-flash for free tier
  return genAI.getGenerativeModel({ model: DEFAULT_MODEL });
}

/**
 * Generate AI response from a prompt
 * @param {string} prompt - The prompt to send to AI
 * @param {Object} options - Additional options
 * @param {string} options.model - Model name (default: 'gemini-1.5-flash' - free tier compatible)
 * @param {number} options.temperature - Temperature for generation (0-1)
 * @param {number} options.maxTokens - Maximum tokens to generate
 * @returns {Promise<string>} AI generated response
 */
export async function generateAIResponse(prompt, options = {}) {
  if (!API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const model = getModel(DEFAULT_MODEL);
    if (!model) {
      throw new Error('Gemini API key not configured');
    }

    const generationConfig = {
      temperature: options.temperature || 0.7,
      topP: options.topP || 0.8,
      topK: options.topK || 40,
      maxOutputTokens: options.maxTokens || 2048,
    };

    // Use the correct API format for gemini-1.5-flash
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });
    
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Provide helpful error messages
    if (error.message?.includes('404') || error.message?.includes('not found')) {
      throw new Error(
        `Model 'gemini-1.5-flash' not available. ` +
        `Please verify your free tier API key has access to this model. ` +
        `Error: ${error.message}`
      );
    }
    
    throw new Error(`AI service error: ${error.message}`);
  }
}

/**
 * Predict surplus food quantity based on historical data and context
 * @param {Object} context - Context data for prediction
 * @param {number} context.historicalAverage - Historical average surplus
 * @param {string} context.dayOfWeek - Day of the week
 * @param {string} context.weather - Weather condition
 * @param {number} context.expectedAttendance - Expected attendance
 * @param {Array} context.recentSurplus - Recent surplus data
 * @returns {Promise<Object>} Prediction result with quantity and reasoning
 */
export async function predictSurplusFood(context) {
  const prompt = `You are an AI assistant helping a canteen predict food surplus. 
Based on the following data, predict today's surplus food quantity in kg and provide reasoning:

Historical Average: ${context.historicalAverage || 'N/A'} kg
Day of Week: ${context.dayOfWeek || 'N/A'}
Weather: ${context.weather || 'N/A'}
Expected Attendance: ${context.expectedAttendance || 'N/A'}
Recent Surplus Data: ${JSON.stringify(context.recentSurplus || [])}

IMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON.

Required JSON format:
{
  "predictedQuantity": <number>,
  "reasoning": "<string>",
  "confidence": "low" or "medium" or "high"
}

Example response:
{
  "predictedQuantity": 25,
  "reasoning": "Based on historical patterns and current conditions, moderate surplus expected.",
  "confidence": "medium"
}`;

  try {
    const response = await generateAIResponse(prompt);
    // Try to parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    // Fallback if JSON parsing fails
    return {
      predictedQuantity: context.historicalAverage || 0,
      reasoning: response,
      confidence: 'medium',
    };
  } catch (error) {
    console.error('Error predicting surplus:', error);
    // Return fallback prediction
    return {
      predictedQuantity: context.historicalAverage || 0,
      reasoning: 'Unable to generate AI prediction. Using historical average.',
      confidence: 'low',
    };
  }
}

/**
 * Get AI recommendations for NGO pickup optimization
 * @param {Object} context - Context data for recommendations
 * @param {Array} context.availableSurplus - List of available surplus items
 * @param {string} context.ngoLocation - NGO location
 * @param {number} context.ngoCapacity - NGO capacity
 * @param {Array} context.pastPickups - Past pickup history
 * @returns {Promise<Object>} Recommendations with prioritized items and suggestions
 */
export async function getNgoPickupRecommendations(context) {
  const prompt = `You are an AI assistant helping an NGO optimize food pickup routes and selections.

Available Surplus Items:
${JSON.stringify(context.availableSurplus || [], null, 2)}

NGO Location: ${context.ngoLocation || 'N/A'}
NGO Capacity: ${context.ngoCapacity || 'N/A'} kg
Past Pickup History: ${JSON.stringify(context.pastPickups || [], null, 2)}

IMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON.

Required JSON format:
{
  "prioritizedItems": [{"id": <number>, "priority": <1-10>, "reason": "<string>"}],
  "routeSuggestions": "<string>",
  "warnings": ["<string>"],
  "estimatedTotalQuantity": <number>
}

Example response:
{
  "prioritizedItems": [{"id": 1, "priority": 9, "reason": "Close distance and urgent deadline"}],
  "routeSuggestions": "Start with closest pickup, then proceed to next nearest location.",
  "warnings": ["Item 2 has tight deadline"],
  "estimatedTotalQuantity": 45
}`;

  try {
    const response = await generateAIResponse(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      prioritizedItems: [],
      routeSuggestions: response,
      warnings: [],
      estimatedTotalQuantity: 0,
    };
  } catch (error) {
    console.error('Error getting NGO recommendations:', error);
    return {
      prioritizedItems: [],
      routeSuggestions: 'Unable to generate AI recommendations.',
      warnings: ['AI service unavailable'],
      estimatedTotalQuantity: 0,
    };
  }
}

/**
 * Get AI insights for analytics and trends
 * @param {Object} context - Analytics context
 * @param {Array} context.weeklyData - Weekly surplus data
 * @param {Array} context.pickupHistory - Pickup history
 * @param {string} context.role - User role ('canteen' or 'ngo')
 * @returns {Promise<Object>} AI insights and recommendations
 */
export async function getAnalyticsInsights(context) {
  const role = context.role || 'canteen';
  const prompt = `You are an AI assistant analyzing food waste data for a ${role === 'canteen' ? 'canteen' : 'NGO'}.

Weekly Surplus Data:
${JSON.stringify(context.weeklyData || [], null, 2)}

Pickup History:
${JSON.stringify(context.pickupHistory || [], null, 2)}

IMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON.

Required JSON format:
{
  "insights": ["<string>"],
  "recommendations": ["<string>"],
  "predictions": {
    "nextWeekSurplus": <number>,
    "trend": "increasing" or "decreasing" or "stable"
  }
}

Example response:
{
  "insights": ["Surplus increased 15% this week", "Friday shows highest waste"],
  "recommendations": ["Adjust Friday meal planning", "Monitor Thursday patterns"],
  "predictions": {
    "nextWeekSurplus": 35,
    "trend": "increasing"
  }
}`;

  try {
    const response = await generateAIResponse(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      insights: [response],
      recommendations: [],
      predictions: {
        nextWeekSurplus: 0,
        trend: 'stable',
      },
    };
  } catch (error) {
    console.error('Error getting analytics insights:', error);
    return {
      insights: ['Unable to generate AI insights.'],
      recommendations: [],
      predictions: {
        nextWeekSurplus: 0,
        trend: 'stable',
      },
    };
  }
}

/**
 * Get AI-powered food safety recommendations
 * @param {Object} foodData - Food item data
 * @param {string} foodData.foodName - Name of the food
 * @param {string} foodData.preparedTime - When food was prepared
 * @param {string} foodData.vegType - Veg or non-veg
 * @param {number} foodData.quantity - Quantity
 * @returns {Promise<Object>} Safety recommendations
 */
export async function getFoodSafetyRecommendations(foodData) {
  const prompt = `You are a food safety AI assistant. Analyze this food item and provide safety recommendations:

Food Name: ${foodData.foodName || 'N/A'}
Prepared Time: ${foodData.preparedTime || 'N/A'}
Type: ${foodData.vegType || 'N/A'}
Quantity: ${foodData.quantity || 'N/A'}

Please provide:
1. Safety assessment (safe, caution, unsafe)
2. Storage recommendations
3. Consumption deadline
4. Any warnings

IMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON.

Required JSON format:
{
  "safetyStatus": "safe" or "caution" or "unsafe",
  "storageRecommendations": "<string>",
  "consumptionDeadline": "<string>",
  "warnings": ["<string>"]
}

Example response:
{
  "safetyStatus": "safe",
  "storageRecommendations": "Store in refrigerator below 4°C",
  "consumptionDeadline": "Within 4 hours",
  "warnings": []
}`;

  try {
    const response = await generateAIResponse(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      safetyStatus: 'caution',
      storageRecommendations: response,
      consumptionDeadline: 'Within 4 hours',
      warnings: [],
    };
  } catch (error) {
    console.error('Error getting safety recommendations:', error);
    return {
      safetyStatus: 'caution',
      storageRecommendations: 'Follow standard food safety guidelines.',
      consumptionDeadline: 'Within 4 hours',
      warnings: ['AI service unavailable'],
    };
  }
}

/**
 * Assess risk level for a pickup item
 * @param {Object} item - Pickup item data
 * @param {Object} context - Context data
 * @param {string} context.ngoLocation - NGO location
 * @param {string} context.currentTime - Current time
 * @param {string} context.weather - Weather condition
 * @returns {Promise<Object>} Risk assessment
 */
export async function assessPickupRisk(item, context = {}) {
  const prompt = `You are a risk assessment AI for food pickup operations. Assess the risk level for this pickup:

Item Details:
${JSON.stringify(item, null, 2)}

NGO Location: ${context.ngoLocation || 'N/A'}
Current Time: ${context.currentTime || new Date().toISOString()}
Weather: ${context.weather || 'Normal'}

Consider:
- Time until deadline (urgency)
- Distance from NGO
- Weather conditions
- Item quantity vs typical capacity
- Time of day

IMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON.

Required JSON format:
{
  "riskLevel": "low" or "medium" or "high",
  "riskScore": <0-100>,
  "riskFactors": ["<string>"],
  "recommendation": "<string>",
  "confidence": "low" or "medium" or "high"
}`;

  try {
    const response = await generateAIResponse(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      riskLevel: 'medium',
      riskScore: 50,
      riskFactors: ['Unable to assess'],
      recommendation: 'Proceed with caution',
      confidence: 'low',
    };
  } catch (error) {
    console.error('Error assessing pickup risk:', error);
    return {
      riskLevel: 'medium',
      riskScore: 50,
      riskFactors: ['AI service unavailable'],
      recommendation: 'Proceed with caution',
      confidence: 'low',
    };
  }
}

/**
 * Optimize pickup route for multiple items
 * @param {Object} context - Route optimization context
 * @param {string} context.ngoLocation - NGO starting location
 * @param {Array} context.pickupLocations - Array of {id, location, deadline, item}
 * @param {string} context.currentTime - Current time
 * @returns {Promise<Object>} Optimized route
 */
export async function optimizePickupRoute(context) {
  const prompt = `You are a route optimization AI. Given these pickup locations, suggest the most efficient route:

NGO Starting Location: ${context.ngoLocation || 'N/A'}
Current Time: ${context.currentTime || new Date().toISOString()}

Pickup Locations:
${JSON.stringify(context.pickupLocations || [], null, 2)}

Consider:
- Distance between locations
- Time constraints (deadlines)
- Traffic patterns (assume normal traffic)
- Fuel efficiency
- Logical sequence

IMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON.

Required JSON format:
{
  "optimalRoute": [
    {"id": <number>, "order": <number>, "location": "<string>", "estimatedArrival": "<string>", "estimatedTime": "<string>"}
  ],
  "totalDistance": "<string>",
  "totalTime": "<string>",
  "totalTimeMinutes": <number>,
  "savings": "<string>",
  "warnings": ["<string>"]
}`;

  try {
    const response = await generateAIResponse(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      optimalRoute: [],
      totalDistance: 'N/A',
      totalTime: 'N/A',
      totalTimeMinutes: 0,
      savings: 'N/A',
      warnings: [],
    };
  } catch (error) {
    console.error('Error optimizing route:', error);
    return {
      optimalRoute: [],
      totalDistance: 'N/A',
      totalTime: 'N/A',
      totalTimeMinutes: 0,
      savings: 'N/A',
      warnings: ['AI service unavailable'],
    };
  }
}

/**
 * Calculate food requirements based on number of people
 * @param {Object} context - Food requirement context
 * @param {number} context.numberOfPeople - Number of people to feed
 * @param {Object} context.ageGroups - Age group breakdown {children: number, adults: number, elderly: number}
 * @param {string} context.mealType - 'breakfast', 'lunch', or 'dinner'
 * @param {string} context.duration - 'single', 'daily', or 'weekly'
 * @param {Array} context.dietaryRestrictions - Dietary restrictions/preferences
 * @returns {Promise<Object>} Food requirement calculation
 */
export async function calculateFoodRequirements(context) {
  const prompt = `You are an AI assistant helping an NGO calculate food requirements.

Number of People: ${context.numberOfPeople || 'N/A'}
Age Groups: ${JSON.stringify(context.ageGroups || {}, null, 2)}
Meal Type: ${context.mealType || 'lunch'}
Duration: ${context.duration || 'single'}
Dietary Restrictions: ${JSON.stringify(context.dietaryRestrictions || [], null, 2)}

IMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON.

Required JSON format:
{
  "totalPortions": <number>,
  "totalKg": <number>,
  "breakdown": {
    "rice": {"portions": <number>, "kg": <number>},
    "vegetables": {"portions": <number>, "kg": <number>},
    "protein": {"portions": <number>, "kg": <number>},
    "other": {"portions": <number>, "kg": <number>}
  },
  "nutritionalInfo": {
    "caloriesPerPerson": <number>,
    "proteinPerPerson": "<string>",
    "carbsPerPerson": "<string>"
  },
  "recommendations": ["<string>"]
}`;

  try {
    const response = await generateAIResponse(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    // Fallback calculation
    const portionsPerPerson = context.mealType === 'breakfast' ? 0.8 : context.mealType === 'dinner' ? 1.2 : 1.0;
    const totalPortions = Math.ceil((context.numberOfPeople || 0) * portionsPerPerson);
    return {
      totalPortions,
      totalKg: Math.ceil(totalPortions * 0.2),
      breakdown: {},
      nutritionalInfo: {},
      recommendations: ['Using basic calculation. AI analysis unavailable.'],
    };
  } catch (error) {
    console.error('Error calculating food requirements:', error);
    return {
      totalPortions: 0,
      totalKg: 0,
      breakdown: {},
      nutritionalInfo: {},
      recommendations: ['Unable to calculate food requirements.'],
    };
  }
}

/**
 * Analyze nutritional value of available surplus items
 * @param {Object} context - Nutritional analysis context
 * @param {Array} context.availableSurplus - Available surplus items
 * @param {number} context.numberOfPeople - Number of people to feed
 * @param {Object} context.ageGroups - Age group breakdown
 * @param {Array} context.healthRequirements - Health requirements
 * @returns {Promise<Object>} Nutritional analysis
 */
export async function analyzeNutritionalValue(context) {
  const prompt = `You are a nutrition AI assistant. Analyze the nutritional value of available surplus food for an NGO.

Available Surplus Items:
${JSON.stringify(context.availableSurplus || [], null, 2)}

Number of People: ${context.numberOfPeople || 'N/A'}
Age Groups: ${JSON.stringify(context.ageGroups || {}, null, 2)}
Health Requirements: ${JSON.stringify(context.healthRequirements || [], null, 2)}

Please provide:
1. Nutritional value per person
2. Missing nutrients
3. Recommendations for balanced meals
4. Health warnings or considerations

IMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON.

Required JSON format:
{
  "nutritionalValue": {
    "caloriesPerPerson": <number>,
    "proteinPerPerson": "<string>",
    "carbsPerPerson": "<string>",
    "fiberPerPerson": "<string>"
  },
  "missingNutrients": ["<string>"],
  "recommendations": ["<string>"],
  "healthWarnings": ["<string>"],
  "balancedMealScore": <0-100>
}`;

  try {
    const response = await generateAIResponse(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      nutritionalValue: {},
      missingNutrients: [],
      recommendations: [response],
      healthWarnings: [],
      balancedMealScore: 50,
    };
  } catch (error) {
    console.error('Error analyzing nutritional value:', error);
    return {
      nutritionalValue: {},
      missingNutrients: [],
      recommendations: ['Unable to analyze nutritional value.'],
      healthWarnings: [],
      balancedMealScore: 0,
    };
  }
}

/**
 * Generate meal planning suggestions
 * @param {Object} context - Meal planning context
 * @param {Array} context.availableSurplus - Available surplus items
 * @param {number} context.numberOfPeople - Number of people
 * @param {string} context.mealType - Meal type
 * @param {number} context.budget - Budget constraint
 * @param {number} context.storageCapacity - Storage capacity
 * @returns {Promise<Object>} Meal planning suggestions
 */
export async function generateMealPlanningSuggestions(context) {
  const prompt = `You are a meal planning AI assistant for NGOs. Suggest optimal meal combinations.

Available Surplus Items:
${JSON.stringify(context.availableSurplus || [], null, 2)}

Number of People: ${context.numberOfPeople || 'N/A'}
Meal Type: ${context.mealType || 'lunch'}
Budget: ${context.budget ? `$${context.budget}` : 'No limit'}
Storage Capacity: ${context.storageCapacity || 'N/A'} kg

Please provide:
1. Suggested meal combinations
2. Optimal food distribution
3. Meal schedule
4. Leftover management

IMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON.

Required JSON format:
{
  "suggestedMeals": [
    {
      "name": "<string>",
      "items": ["<string>"],
      "portions": <number>,
      "nutritionalValue": "<string>"
    }
  ],
  "distributionPlan": "<string>",
  "mealSchedule": "<string>",
  "leftoverManagement": "<string>",
  "costEstimate": "<string>"
}`;

  try {
    const response = await generateAIResponse(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      suggestedMeals: [],
      distributionPlan: response,
      mealSchedule: 'N/A',
      leftoverManagement: 'N/A',
      costEstimate: 'N/A',
    };
  } catch (error) {
    console.error('Error generating meal planning suggestions:', error);
    return {
      suggestedMeals: [],
      distributionPlan: 'Unable to generate meal plan.',
      mealSchedule: 'N/A',
      leftoverManagement: 'N/A',
      costEstimate: 'N/A',
    };
  }
}

/**
 * Predict impact of food distribution
 * @param {Object} context - Impact prediction context
 * @param {number} context.numberOfPeople - Number of people
 * @param {number} context.foodQuantity - Food quantity in kg
 * @param {string} context.location - Distribution location
 * @param {Array} context.previousImpact - Previous impact data
 * @returns {Promise<Object>} Impact prediction
 */
export async function predictImpact(context) {
  const prompt = `You are an impact prediction AI for food distribution programs.

Number of People: ${context.numberOfPeople || 'N/A'}
Food Quantity: ${context.foodQuantity || 'N/A'} kg
Location: ${context.location || 'N/A'}
Previous Impact Data: ${JSON.stringify(context.previousImpact || [], null, 2)}

Please predict:
1. Estimated people fed
2. Environmental impact (CO2 saved, waste reduced)
3. Social impact metrics
4. Success probability

IMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON.

Required JSON format:
{
  "peopleFed": <number>,
  "environmentalImpact": {
    "co2Saved": "<string>",
    "wasteReduced": "<string>",
    "waterSaved": "<string>"
  },
  "socialImpact": {
    "mealsProvided": <number>,
    "familiesHelped": <number>,
    "impactScore": <0-100>
  },
  "successProbability": "low" or "medium" or "high",
  "recommendations": ["<string>"]
}`;

  try {
    const response = await generateAIResponse(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    const peopleFed = context.numberOfPeople || 0;
    return {
      peopleFed,
      environmentalImpact: {
        co2Saved: 'Calculating...',
        wasteReduced: 'Calculating...',
        waterSaved: 'Calculating...',
      },
      socialImpact: {
        mealsProvided: peopleFed,
        familiesHelped: Math.ceil(peopleFed / 4),
        impactScore: 50,
      },
      successProbability: 'medium',
      recommendations: [response],
    };
  } catch (error) {
    console.error('Error predicting impact:', error);
    return {
      peopleFed: 0,
      environmentalImpact: {},
      socialImpact: {},
      successProbability: 'low',
      recommendations: ['Unable to predict impact.'],
    };
  }
}

/**
 * List available models (helper function for debugging)
 * @returns {Promise<Array>} List of available model names
 */
export async function listAvailableModels() {
  if (!API_KEY) {
    return [];
  }
  try {
    // Note: This might not be available in all SDK versions
    // If it fails, we'll just return the default model
    const models = await genAI.listModels();
    return models || [DEFAULT_MODEL];
  } catch (error) {
    console.warn('Could not list models, using default:', error);
    return [DEFAULT_MODEL];
  }
}

/**
 * Check if AI service is available
 * @returns {boolean} True if API key is configured
 */
export function isAIServiceAvailable() {
  return !!API_KEY;
}
