import React, { useState } from 'react';
import Button from '../ui/Button';
import InputField from '../ui/InputField';
import {
  calculateFoodRequirements,
  analyzeNutritionalValue,
  generateMealPlanningSuggestions,
  predictImpact,
  isAIServiceAvailable,
} from '../../utils/aiService';

/**
 * AI Suggestions Panel Component
 * Provides multiple AI-powered suggestions for NGOs
 */
const AISuggestionsPanel = ({ availableSurplus = [] }) => {
  const [activeTab, setActiveTab] = useState('requirements');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({});

  // Form state for food requirements
  const [requirementsForm, setRequirementsForm] = useState({
    numberOfPeople: '',
    mealType: 'lunch',
    duration: 'single',
    children: '',
    adults: '',
    elderly: '',
    dietaryRestrictions: [],
  });

  const handleRequirementsSubmit = async (e) => {
    e.preventDefault();
    if (!isAIServiceAvailable()) {
      alert('AI service not available. Please configure API key.');
      return;
    }

    setIsLoading(true);
    try {
      const ageGroups = {
        children: parseInt(requirementsForm.children) || 0,
        adults: parseInt(requirementsForm.adults) || parseInt(requirementsForm.numberOfPeople) || 0,
        elderly: parseInt(requirementsForm.elderly) || 0,
      };

      const result = await calculateFoodRequirements({
        numberOfPeople: parseInt(requirementsForm.numberOfPeople) || 0,
        ageGroups,
        mealType: requirementsForm.mealType,
        duration: requirementsForm.duration,
        dietaryRestrictions: requirementsForm.dietaryRestrictions,
      });
      setResults({ ...results, requirements: result });
    } catch (error) {
      console.error('Error calculating requirements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNutritionalAnalysis = async () => {
    if (!isAIServiceAvailable()) {
      alert('AI service not available. Please configure API key.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await analyzeNutritionalValue({
        availableSurplus,
        numberOfPeople: parseInt(requirementsForm.numberOfPeople) || 0,
        ageGroups: {
          children: parseInt(requirementsForm.children) || 0,
          adults: parseInt(requirementsForm.adults) || 0,
          elderly: parseInt(requirementsForm.elderly) || 0,
        },
        healthRequirements: requirementsForm.dietaryRestrictions,
      });
      setResults({ ...results, nutrition: result });
    } catch (error) {
      console.error('Error analyzing nutrition:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMealPlanning = async () => {
    if (!isAIServiceAvailable()) {
      alert('AI service not available. Please configure API key.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateMealPlanningSuggestions({
        availableSurplus,
        numberOfPeople: parseInt(requirementsForm.numberOfPeople) || 0,
        mealType: requirementsForm.mealType,
      });
      setResults({ ...results, mealPlanning: result });
    } catch (error) {
      console.error('Error generating meal plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImpactPrediction = async () => {
    if (!isAIServiceAvailable()) {
      alert('AI service not available. Please configure API key.');
      return;
    }

    setIsLoading(true);
    try {
      const totalKg = availableSurplus.reduce((sum, item) => {
        const qty = item.quantity?.match(/\d+/)?.[0] || 0;
        return sum + parseInt(qty) * 0.2; // Rough estimate: 0.2kg per portion
      }, 0);

      const result = await predictImpact({
        numberOfPeople: parseInt(requirementsForm.numberOfPeople) || 0,
        foodQuantity: totalKg,
        location: 'NGO Location',
        previousImpact: [],
      });
      setResults({ ...results, impact: result });
    } catch (error) {
      console.error('Error predicting impact:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'requirements', label: 'Food Requirements', icon: '🍽️' },
    { id: 'nutrition', label: 'Nutrition Analysis', icon: '🥗' },
    { id: 'meal-planning', label: 'Meal Planning', icon: '📋' },
    { id: 'impact', label: 'Impact Prediction', icon: '📊' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-green-200 p-5 shadow-md shadow-green-100/50 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">🤖 AI Suggestions</h3>
          <p className="text-[10px] text-slate-500">Get AI-powered recommendations</p>
        </div>
        {!isAIServiceAvailable() && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-700 ring-1 ring-amber-200">
            API Key Required
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-green-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1 whitespace-nowrap border-b-2 px-2 py-1.5 text-[11px] font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px] space-y-4">
        {activeTab === 'requirements' && (
          <div className="space-y-3">
            <form onSubmit={handleRequirementsSubmit} className="space-y-3 text-xs">
              <InputField
                label="Number of People"
                name="numberOfPeople"
                type="number"
                value={requirementsForm.numberOfPeople}
                onChange={(e) =>
                  setRequirementsForm({ ...requirementsForm, numberOfPeople: e.target.value })
                }
                placeholder="e.g., 50"
                required
              />
              <div className="grid gap-2 md:grid-cols-3">
                <InputField
                  label="Children"
                  name="children"
                  type="number"
                  value={requirementsForm.children}
                  onChange={(e) =>
                    setRequirementsForm({ ...requirementsForm, children: e.target.value })
                  }
                  placeholder="0"
                />
                <InputField
                  label="Adults"
                  name="adults"
                  type="number"
                  value={requirementsForm.adults}
                  onChange={(e) =>
                    setRequirementsForm({ ...requirementsForm, adults: e.target.value })
                  }
                  placeholder="0"
                />
                <InputField
                  label="Elderly"
                  name="elderly"
                  type="number"
                  value={requirementsForm.elderly}
                  onChange={(e) =>
                    setRequirementsForm({ ...requirementsForm, elderly: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-gray-300">Meal Type</label>
                  <select
                    value={requirementsForm.mealType}
                    onChange={(e) =>
                      setRequirementsForm({ ...requirementsForm, mealType: e.target.value })
                    }
                    className="w-full rounded-lg border border-emerald-400/30 bg-slate-900/60 px-2 py-1.5 text-xs text-gray-200 shadow-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 focus:outline-none"
                  >
                    <option value="breakfast" className="bg-slate-900 text-gray-200">Breakfast</option>
                    <option value="lunch" className="bg-slate-900 text-gray-200">Lunch</option>
                    <option value="dinner" className="bg-slate-900 text-gray-200">Dinner</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-gray-300">Duration</label>
                  <select
                    value={requirementsForm.duration}
                    onChange={(e) =>
                      setRequirementsForm({ ...requirementsForm, duration: e.target.value })
                    }
                    className="w-full rounded-lg border border-emerald-400/30 bg-slate-900/60 px-2 py-1.5 text-xs text-gray-200 shadow-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 focus:outline-none"
                  >
                    <option value="single" className="bg-slate-900 text-gray-200">Single Meal</option>
                    <option value="daily" className="bg-slate-900 text-gray-200">Daily</option>
                    <option value="weekly" className="bg-slate-900 text-gray-200">Weekly</option>
                  </select>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg shadow-green-200/50 hover:from-green-600 hover:to-teal-600" 
                disabled={isLoading}
              >
                {isLoading ? 'Calculating...' : 'Calculate Requirements'}
              </Button>
            </form>

            {results.requirements && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-3 space-y-2 text-xs">
                <p className="font-semibold text-green-700">AI Calculation Results:</p>
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <span className="text-slate-600">Total Portions:</span>
                    <span className="ml-2 font-semibold text-green-600">{results.requirements.totalPortions}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Total Weight:</span>
                    <span className="ml-2 font-semibold text-green-600">{results.requirements.totalKg} kg</span>
                  </div>
                </div>
                {results.requirements.recommendations && (
                  <div className="mt-2 space-y-1">
                    <p className="font-medium text-green-700">Recommendations:</p>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                      {results.requirements.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-600">
              Analyze nutritional value of available surplus items.
            </p>
            <Button 
              onClick={handleNutritionalAnalysis} 
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg shadow-green-200/50 hover:from-green-600 hover:to-teal-600" 
              disabled={isLoading}
            >
              {isLoading ? 'Analyzing...' : 'Analyze Nutrition'}
            </Button>

            {results.nutrition && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-3 space-y-2 text-xs">
                <p className="font-semibold text-green-700">Nutritional Analysis:</p>
                {results.nutrition.balancedMealScore && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">Balanced Meal Score:</span>
                    <span className="font-semibold text-green-600">
                      {results.nutrition.balancedMealScore}/100
                    </span>
                  </div>
                )}
                {results.nutrition.recommendations && (
                  <div className="mt-2 space-y-1">
                    <p className="font-medium text-green-700">Recommendations:</p>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                      {results.nutrition.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'meal-planning' && (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-600">
              Get AI suggestions for meal planning and distribution.
            </p>
            <Button 
              onClick={handleMealPlanning} 
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg shadow-green-200/50 hover:from-green-600 hover:to-teal-600" 
              disabled={isLoading}
            >
              {isLoading ? 'Generating Plan...' : 'Generate Meal Plan'}
            </Button>

            {results.mealPlanning && (
              <div className="rounded-lg bg-teal-50 border border-teal-200 p-3 space-y-2 text-xs">
                <p className="font-semibold text-teal-700">Meal Planning Suggestions:</p>
                {results.mealPlanning.distributionPlan && (
                  <p className="text-[11px] text-slate-600">{results.mealPlanning.distributionPlan}</p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-600">
              Predict the impact of your food distribution.
            </p>
            <Button 
              onClick={handleImpactPrediction} 
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg shadow-green-200/50 hover:from-green-600 hover:to-teal-600" 
              disabled={isLoading}
            >
              {isLoading ? 'Predicting...' : 'Predict Impact'}
            </Button>

            {results.impact && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 space-y-2 text-xs">
                <p className="font-semibold text-emerald-700">Impact Prediction:</p>
                <div className="grid gap-2">
                  {results.impact.peopleFed && (
                    <div>
                      <span className="text-slate-600">People Fed:</span>
                      <span className="ml-2 font-semibold text-emerald-600">{results.impact.peopleFed}</span>
                    </div>
                  )}
                  {results.impact.socialImpact && (
                    <div>
                      <span className="text-slate-600">Meals Provided:</span>
                      <span className="ml-2 font-semibold text-emerald-600">
                        {results.impact.socialImpact.mealsProvided}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AISuggestionsPanel;
