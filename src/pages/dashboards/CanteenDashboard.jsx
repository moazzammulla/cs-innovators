import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import { fadeInUp, staggerContainer } from '../../utils/motionPresets';

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

  const loadData = async () => {
    const [surplus, recentPosts, analytics] = await Promise.all([
      fetchTodaysSurplus(),
      fetchCanteenSurplusPosts(),
      fetchAnalytics(),
    ]);
    setTodaySurplus(surplus);
    setPosts(recentPosts);
    setWeeklyData(analytics.weeklySurplusData);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div
        className="flex flex-col justify-between gap-3 md:flex-row md:items-center"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <div>
          <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-[11px] font-medium text-blue-600 ring-1 ring-blue-200 mb-2">
            <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
            AI-Powered Dashboard • Real-time insights
          </div>
          <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-3xl font-semibold leading-tight text-transparent md:text-4xl">
            Canteen Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            View today&apos;s AI predicted surplus and manage your surplus posts.
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            as={Link}
            to="/canteen/add-surplus"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-200/50 hover:from-blue-600 hover:to-purple-600 md:w-auto"
          >
            Add Surplus Food
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid gap-4 md:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeInUp}>
          <div className="bg-white group relative overflow-hidden rounded-2xl border border-blue-200 p-5 shadow-md shadow-blue-100/50 transition-all hover:shadow-lg hover:shadow-blue-200/70 hover:border-blue-300">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100 blur-2xl opacity-0 transition-opacity group-hover:opacity-50" />
            <p className="text-xs font-medium uppercase tracking-wide text-blue-600 mb-2">
              Today&apos;s AI Predicted Surplus
            </p>
            <p className="text-3xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {todaySurplus} kg
            </p>
            <p className="text-xs text-slate-500 mt-2">Based on historical patterns and live signals</p>
          </div>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <div className="bg-white group relative overflow-hidden rounded-2xl border border-purple-200 p-5 shadow-md shadow-purple-100/50 transition-all hover:shadow-lg hover:shadow-purple-200/70 hover:border-purple-300">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-100 blur-2xl opacity-0 transition-opacity group-hover:opacity-50" />
            <p className="text-xs font-medium uppercase tracking-wide text-purple-600 mb-2">
              Active Surplus Posts
            </p>
            <p className="text-3xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {posts.filter((p) => p.status !== 'Delivered').length}
            </p>
            <p className="text-xs text-slate-500 mt-2">Awaiting NGO assignment or pickup</p>
          </div>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <div className="bg-white group relative overflow-hidden rounded-2xl border border-pink-200 p-5 shadow-md shadow-pink-100/50 transition-all hover:shadow-lg hover:shadow-pink-200/70 hover:border-pink-300">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-pink-100 blur-2xl opacity-0 transition-opacity group-hover:opacity-50" />
            <p className="text-xs font-medium uppercase tracking-wide text-pink-600 mb-2">
              Meals Saved This Week
            </p>
            <p className="text-3xl font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              320+
            </p>
            <p className="text-xs text-slate-500 mt-2">Estimated from delivered surplus</p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid gap-4 lg:grid-cols-3"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="bg-white lg:col-span-2 rounded-2xl border border-blue-200 p-5 shadow-md shadow-blue-100/50"
          whileHover={{ borderColor: 'rgba(59,130,246,0.5)', boxShadow: '0 10px 25px rgba(59,130,246,0.15)' }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">Recent Surplus Posts</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Track your food surplus submissions</p>
            </div>
            <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] text-blue-600 ring-1 ring-blue-200">
              Live
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] text-slate-500">
                  <th className="py-3 pr-4 font-medium">Food</th>
                  <th className="py-3 pr-4 font-medium">Quantity</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, idx) => (
                  <motion.tr
                    key={post.id}
                    className="border-b border-slate-100 text-[11px] transition-colors hover:bg-blue-50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                  >
                    <td className="py-3 pr-4 font-medium text-slate-700">
                      {post.foodName}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{post.quantity}</td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="py-3 pr-4 text-slate-500">{post.createdAt}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        <motion.div
          className="bg-white rounded-2xl border border-purple-200 p-5 shadow-md shadow-purple-100/50"
          whileHover={{ borderColor: 'rgba(168,85,247,0.5)', boxShadow: '0 10px 25px rgba(168,85,247,0.15)' }}
          transition={{ duration: 0.3 }}
        >
          <p className="mb-3 text-sm font-semibold text-slate-700">
            Weekly Surplus (kg)
          </p>
          <ChartComponent type="bar" data={weeklyData} dataKey="value" nameKey="name" />
        </motion.div>
      </motion.div>

      {/* Find Nearest NGO Section */}
      <motion.div
        className="bg-white space-y-4 rounded-2xl border border-blue-200 p-6 shadow-md shadow-blue-100/50"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <div>
          <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-[11px] font-medium text-blue-600 ring-1 ring-blue-200 mb-3">
            <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
            AI-Powered Matching
          </div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Find Nearest NGO
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Search for NGOs in your area by entering your pincode
          </p>
        </div>

        <motion.form
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
          className="flex gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                disabled={isLoadingNgos}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-200/50 hover:from-blue-600 hover:to-purple-600"
              >
                {isLoadingNgos ? 'Searching...' : 'Search'}
              </Button>
            </motion.div>
          </div>
        </motion.form>

        {/* AI Recommendation */}
        {(isLoadingAI || aiRecommendation) && (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <AINgoRecommendation
              recommendation={aiRecommendation}
              isLoading={isLoadingAI}
            />
          </motion.div>
        )}

        {/* NGO Results */}
        {ngos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  {aiRecommendation
                    ? `All ${ngos.length} NGO${ngos.length > 1 ? 's' : ''} nearby`
                    : `Found ${ngos.length} NGO${ngos.length > 1 ? 's' : ''} nearby`}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Select an NGO to contact</p>
              </div>
              {!isAIServiceAvailable() && (
                <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] text-amber-700 ring-1 ring-amber-200">
                  AI unavailable
                </span>
              )}
            </div>
            <motion.div
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {ngos.map((ngo, idx) => (
                <motion.div
                  key={ngo.id}
                  variants={fadeInUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <NgoCard ngo={ngo} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {searchError && ngos.length === 0 && (
          <motion.div
            className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700 ring-1 ring-amber-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {searchError}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CanteenDashboard;
