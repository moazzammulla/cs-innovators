# AI Integration Setup Guide

This project uses Google Gemini AI for intelligent features in both Canteen and NGO dashboards.

## Setup Instructions

### 1. Get Your Free Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy your API key

### 2. Configure Environment Variable

Create a `.env` file in the root directory of the project:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Important:** 
- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Replace `your_actual_api_key_here` with your actual API key from Google AI Studio

### 3. Restart Development Server

After creating/updating the `.env` file, restart your development server:

```bash
npm run dev
```

## Available AI Functions

The AI service is located at `src/utils/aiService.js` and provides the following functions:

### For Canteen Dashboard:
- `predictSurplusFood(context)` - Predicts surplus food quantity based on historical data
- `getFoodSafetyRecommendations(foodData)` - Provides food safety recommendations
- `getAnalyticsInsights(context)` - Generates insights from analytics data

### For NGO Dashboard:
- `getNgoPickupRecommendations(context)` - Optimizes pickup routes and item selection
- `getAnalyticsInsights(context)` - Generates insights from analytics data

### General:
- `generateAIResponse(prompt, options)` - Generic AI response generator
- `isAIServiceAvailable()` - Checks if API key is configured

## Usage Example

```javascript
import { predictSurplusFood, getNgoPickupRecommendations } from '../utils/aiService';

// In Canteen Dashboard
const prediction = await predictSurplusFood({
  historicalAverage: 25,
  dayOfWeek: 'Monday',
  weather: 'Sunny',
  expectedAttendance: 150,
  recentSurplus: [20, 25, 30]
});

// In NGO Dashboard
const recommendations = await getNgoPickupRecommendations({
  availableSurplus: [...],
  ngoLocation: 'City Center',
  ngoCapacity: 50,
  pastPickups: [...]
});
```

## Model Information

- **Default Model:** `gemini-1.5-flash` (Free tier, fast responses)
- **Alternative Models:** `gemini-pro`, `gemini-1.5-pro` (if you have access)

## Error Handling

The AI service includes error handling and fallback responses. If the API key is not configured or there's an error, the functions will return safe fallback values instead of crashing the application.

## Free Tier Limits

Google Gemini free tier typically includes:
- Generous free quota per month
- Rate limits per minute
- No credit card required

Check [Google AI Studio](https://aistudio.google.com/) for current limits and pricing.
