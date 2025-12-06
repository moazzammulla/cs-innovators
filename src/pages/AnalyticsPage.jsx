import React, { useEffect, useState } from 'react';
import ChartComponent from '../components/charts/ChartComponent';
import { fetchAnalytics } from '../utils/api';
import StatusBadge from '../components/ui/StatusBadge';

const AnalyticsPage = () => {
  const [weeklySurplus, setWeeklySurplus] = useState([]);
  const [foodSaved, setFoodSaved] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const { weeklySurplusData, foodSavedData, pickupHistory } = await fetchAnalytics();
      setWeeklySurplus(weeklySurplusData);
      setFoodSaved(foodSavedData);
      setHistory(pickupHistory);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
    // Refresh every 5 seconds to get updated data
    const interval = setInterval(loadAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-secondary">Analytics</h1>
        <p className="text-xs text-gray-500">
          Visualize food surplus, saved meals, and pickup performance.
        </p>
      </div>

      {isLoading ? (
        <div className="card p-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-3 text-xs text-gray-500">Loading analytics...</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card lg:col-span-2">
            <p className="mb-2 text-xs font-medium text-secondary">
              Weekly Surplus (kg) - Last 7 Days
            </p>
            <ChartComponent type="bar" data={weeklySurplus} dataKey="value" nameKey="name" />
            {weeklySurplus.length === 0 && (
              <p className="mt-4 text-center text-xs text-gray-500">
                No surplus data available. Add surplus posts to see analytics.
              </p>
            )}
          </div>
          <div className="card">
            <p className="mb-2 text-xs font-medium text-secondary">Food Saved vs Wasted</p>
            <ChartComponent type="pie" data={foodSaved} dataKey="value" nameKey="name" />
            {foodSaved.length === 0 && (
              <p className="mt-4 text-center text-xs text-gray-500">
                No pickup data available.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="card">
        <div className="mb-3 flex items-center justify-between text-xs">
          <p className="font-medium text-secondary">Recent Pickup History</p>
          {history.length > 0 && (
            <span className="text-gray-400">{history.length} pickup{history.length > 1 ? 's' : ''}</span>
          )}
        </div>
        {history.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-xs text-gray-500">No pickup history available.</p>
            <p className="mt-1 text-[11px] text-gray-400">
              Pickups will appear here once NGOs accept surplus food posts.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] text-gray-500">
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Food</th>
                  <th className="py-2 pr-4 font-medium">NGO</th>
                  <th className="py-2 pr-4 font-medium">Quantity</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50 text-[11px]">
                    <td className="py-2 pr-4 text-gray-600">{row.date}</td>
                    <td className="py-2 pr-4 font-medium text-gray-800">{row.foodName}</td>
                    <td className="py-2 pr-4 text-gray-600">{row.ngo}</td>
                    <td className="py-2 pr-4 text-gray-600">{row.quantity}</td>
                    <td className="py-2 pr-4">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
