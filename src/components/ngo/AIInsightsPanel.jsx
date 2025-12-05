import React from 'react';

/**
 * AI Insights Panel Component
 * Displays AI-generated recommendations and insights
 */
const AIInsightsPanel = ({ recommendations, isLoading }) => {
  if (isLoading) {
    return (
      <div className="card space-y-3">
        <p className="text-xs font-medium text-secondary">AI Recommendations</p>
        <div className="flex items-center gap-2 text-[11px] text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Analyzing pickups...
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="card space-y-3">
        <p className="text-xs font-medium text-secondary">AI Recommendations</p>
        <p className="text-[11px] text-gray-500">
          AI analysis unavailable. Please configure API key.
        </p>
      </div>
    );
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-secondary">🤖 AI Recommendations</p>
        <span className="text-[10px] text-gray-400">Powered by Gemini</span>
      </div>

      {recommendations.routeSuggestions && (
        <div className="space-y-2">
          <p className="text-[11px] font-medium text-gray-700">Route Optimization</p>
          <p className="text-[11px] text-gray-600">{recommendations.routeSuggestions}</p>
        </div>
      )}

      {recommendations.warnings && recommendations.warnings.length > 0 && (
        <div className="space-y-2 rounded-lg bg-yellow-50 p-2">
          <p className="text-[11px] font-medium text-yellow-800">⚠️ Warnings</p>
          <ul className="space-y-1">
            {recommendations.warnings.map((warning, idx) => (
              <li key={idx} className="text-[11px] text-yellow-700">
                • {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendations.estimatedTotalQuantity && (
        <div className="rounded-lg bg-primary/5 p-2">
          <p className="text-[11px] font-medium text-primary">
            Estimated Total: {recommendations.estimatedTotalQuantity} portions
          </p>
        </div>
      )}

      {recommendations.prioritizedItems && recommendations.prioritizedItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-medium text-gray-700">Top Recommendations</p>
          <div className="space-y-1">
            {recommendations.prioritizedItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded bg-gray-50 p-2 text-[11px]"
              >
                <span className="text-gray-700">Item #{item.id}</span>
                <span className="font-medium text-secondary">
                  Priority: {item.priority}/10
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsightsPanel;
