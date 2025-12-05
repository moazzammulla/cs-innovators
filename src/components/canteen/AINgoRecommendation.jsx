import React from 'react';
import Button from '../ui/Button';
import NgoCard from './NgoCard';

/**
 * AI NGO Recommendation Component
 * Displays AI-powered recommendation for the best NGO
 */
const AINgoRecommendation = ({ recommendation, isLoading, onCall }) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-4">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <div>
            <p className="text-sm font-semibold text-secondary">🤖 AI Analyzing...</p>
            <p className="text-[11px] text-gray-500">Finding the best NGO match for you</p>
          </div>
        </div>
      </div>
    );
  }

  if (!recommendation || !recommendation.recommendedNgo) {
    return null;
  }

  const { recommendedNgo, reasoning, confidence, factors, alternativeOptions } = recommendation;

  const confidenceColors = {
    high: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  return (
    <div className="space-y-4">
      {/* AI Recommendation Header */}
      <div className="rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🤖</span>
              <p className="text-sm font-semibold text-secondary">AI Recommended NGO</p>
            </div>
            <span
              className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                confidenceColors[confidence] || confidenceColors.medium
              }`}
            >
              {confidence?.toUpperCase() || 'MEDIUM'} Confidence
            </span>
          </div>
          <span className="text-[10px] text-gray-400">Powered by Gemini AI</span>
        </div>

        {/* Reasoning */}
        <div className="mb-3 rounded-lg bg-white/60 p-3">
          <p className="text-xs font-medium text-gray-700 mb-2">💡 Why this NGO?</p>
          <p className="text-[11px] text-gray-600 leading-relaxed">{reasoning}</p>
        </div>

        {/* Key Factors */}
        {factors && Object.keys(factors).length > 0 && (
          <div className="grid gap-2 md:grid-cols-2">
            {Object.entries(factors).map(([key, value]) => (
              <div key={key} className="rounded bg-white/40 p-2">
                <p className="text-[10px] font-medium text-gray-600 capitalize mb-0.5">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </p>
                <p className="text-[11px] text-gray-700">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended NGO Card */}
      <div className="relative">
        <div className="absolute -top-2 -left-2 z-10 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white shadow-lg">
          ⭐ BEST MATCH
        </div>
        <NgoCard ngo={recommendedNgo} />
      </div>

      {/* Alternative Options */}
      {alternativeOptions && alternativeOptions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600">Other Good Options:</p>
          <div className="space-y-2">
            {alternativeOptions.map((alt, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-gray-200 bg-gray-50 p-2 text-[11px]"
              >
                <p className="font-medium text-gray-700">NGO #{alt.ngoId}</p>
                <p className="text-gray-600 text-[10px] mt-0.5">{alt.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AINgoRecommendation;

