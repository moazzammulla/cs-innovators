import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../../components/ui/DashboardCard';
import StatusBadge from '../../components/ui/StatusBadge';
import ChartComponent from '../../components/charts/ChartComponent';
import Button from '../../components/ui/Button';
import InputField from '../../components/ui/InputField';
import NgoCard from '../../components/canteen/NgoCard';
import AINgoRecommendation from '../../components/canteen/AINgoRecommendation';
import {
  fetchTodaysSurplus,
  fetchCanteenSurplusPosts,
  fetchAnalytics,
  fetchNgosByPincode,
} from '../../utils/api';
import { recommendBestNgo, isAIServiceAvailable } from '../../utils/aiService';

const CanteenDashboard = () => {
  const [todaySurplus, setTodaySurplus] = useState(0);
  const [posts, setPosts] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [pincode, setPincode] = useState('');
  const [ngos, setNgos] = useState([]);
  const [isLoadingNgos, setIsLoadingNgos] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    async function load() {
      const [surplus, recentPosts, analytics] = await Promise.all([
        fetchTodaysSurplus(),
        fetchCanteenSurplusPosts(),
        fetchAnalytics(),
      ]);
      setTodaySurplus(surplus);
      setPosts(recentPosts);
      setWeeklyData(analytics.weeklySurplusData);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-xl font-semibold text-secondary">Canteen Dashboard</h1>
          <p className="text-xs text-gray-500">
            View today&apos;s AI predicted surplus and manage your surplus posts.
          </p>
        </div>
        <Button as={Link} to="/canteen/add-surplus" className="w-full md:w-auto">
          Add Surplus Food
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard
          title="Today&apos;s AI Predicted Surplus"
          value={`${todaySurplus} kg`}
          subtitle="Based on historical patterns and live signals (mock)"
        />
        <DashboardCard
          title="Active Surplus Posts"
          value={posts.filter((p) => p.status !== 'Delivered').length}
          subtitle="Awaiting NGO assignment or pickup"
        />
        <DashboardCard
          title="Meals Saved This Week"
          value={320}
          subtitle="Estimated from delivered surplus"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="mb-3 flex items-center justify-between text-xs">
            <p className="font-medium text-secondary">Recent Surplus Posts</p>
            <span className="text-gray-400">Mock data</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] text-gray-500">
                  <th className="py-2 pr-4 font-medium">Food</th>
                  <th className="py-2 pr-4 font-medium">Quantity</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-50 text-[11px]">
                    <td className="py-2 pr-4 font-medium text-gray-800">
                      {post.foodName}
                    </td>
                    <td className="py-2 pr-4 text-gray-600">{post.quantity}</td>
                    <td className="py-2 pr-4">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="py-2 pr-4 text-gray-500">{post.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <p className="mb-2 text-xs font-medium text-secondary">
            Weekly Surplus (kg)
          </p>
          <ChartComponent type="bar" data={weeklyData} dataKey="value" nameKey="name" />
        </div>
      </div>

      {/* Find Nearest NGO Section */}
      <div className="card space-y-4">
        <div>
          <h2 className="text-base font-semibold text-secondary">Find Nearest NGO</h2>
          <p className="text-xs text-gray-500 mt-1">
            Search for NGOs in your area by entering your pincode
          </p>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!pincode.trim()) {
              setSearchError('Please enter a pincode');
              return;
            }
            setIsLoadingNgos(true);
            setSearchError('');
            setAiRecommendation(null);
            try {
              const results = await fetchNgosByPincode(pincode.trim());
              setNgos(results);
              if (results.length === 0) {
                setSearchError('No NGOs found for this pincode');
              } else if (results.length > 0) {
                // Get AI recommendation if AI service is available
                if (isAIServiceAvailable()) {
                  setIsLoadingAI(true);
                  try {
                    const recommendation = await recommendBestNgo({
                      ngos: results,
                      canteenContext: {
                        todaySurplus: todaySurplus,
                        pincode: pincode.trim(),
                      },
                    });
                    setAiRecommendation(recommendation);
                  } catch (error) {
                    console.error('Error getting AI recommendation:', error);
                    // Continue without AI recommendation
                  } finally {
                    setIsLoadingAI(false);
                  }
                }
              }
            } catch (error) {
              console.error('Error fetching NGOs:', error);
              setSearchError('Failed to fetch NGOs. Please try again.');
            } finally {
              setIsLoadingNgos(false);
            }
          }}
          className="flex gap-2"
        >
          <div className="flex-1">
            <InputField
              label="Enter Pincode"
              name="pincode"
              type="text"
              placeholder="e.g., 560001"
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value);
                setSearchError('');
              }}
              maxLength={6}
              pattern="[0-9]{6}"
              error={searchError}
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={isLoadingNgos}>
              {isLoadingNgos ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </form>

        {/* AI Recommendation */}
        {(isLoadingAI || aiRecommendation) && (
          <div className="space-y-3">
            <AINgoRecommendation
              recommendation={aiRecommendation}
              isLoading={isLoadingAI}
            />
          </div>
        )}

        {/* NGO Results */}
        {ngos.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-secondary">
                {aiRecommendation
                  ? `All ${ngos.length} NGO${ngos.length > 1 ? 's' : ''} nearby`
                  : `Found ${ngos.length} NGO${ngos.length > 1 ? 's' : ''} nearby`}
              </p>
              {!isAIServiceAvailable() && (
                <span className="text-[10px] text-gray-400">
                  AI recommendations unavailable
                </span>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ngos.map((ngo) => (
                <NgoCard key={ngo.id} ngo={ngo} />
              ))}
            </div>
          </div>
        )}

        {searchError && ngos.length === 0 && (
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-xs text-yellow-800">
            {searchError}
          </div>
        )}
      </div>
    </div>
  );
};

export default CanteenDashboard;
