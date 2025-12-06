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
    // Refresh every 5 seconds to get new posts
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
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
          <div className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-400/40 mb-2">
            <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
            AI-Powered Dashboard • Real-time insights
          </div>
          <h1 className="bg-gradient-to-r from-emerald-300 via-lime-200 to-cyan-300 bg-clip-text text-3xl font-semibold leading-tight text-transparent md:text-4xl">
            Canteen Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            View today&apos;s AI predicted surplus and manage your surplus posts.
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            as={Link}
            to="/canteen/add-surplus"
            className="w-full bg-emerald-500 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:bg-emerald-400 md:w-auto"
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
          <div className="glass-card group relative overflow-hidden rounded-2xl border border-emerald-400/30 p-5 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:border-emerald-400/50">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-300/80 mb-2">
              Today&apos;s AI Predicted Surplus
            </p>
            <p className="text-3xl font-semibold bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              {todaySurplus} kg
            </p>
            <p className="text-xs text-gray-400 mt-2">Based on historical patterns and live signals</p>
          </div>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <div className="glass-card group relative overflow-hidden rounded-2xl border border-cyan-400/30 p-5 shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:border-cyan-400/50">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
            <p className="text-xs font-medium uppercase tracking-wide text-cyan-300/80 mb-2">
              Active Surplus Posts
            </p>
            <p className="text-3xl font-semibold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              {posts.filter((p) => p.status !== 'Delivered').length}
            </p>
            <p className="text-xs text-gray-400 mt-2">Awaiting NGO assignment or pickup</p>
          </div>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <div className="glass-card group relative overflow-hidden rounded-2xl border border-lime-400/30 p-5 shadow-[0_0_20px_rgba(132,204,22,0.2)] transition-all hover:shadow-[0_0_30px_rgba(132,204,22,0.3)] hover:border-lime-400/50">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-lime-400/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
            <p className="text-xs font-medium uppercase tracking-wide text-lime-300/80 mb-2">
              Meals Saved This Week
            </p>
            <p className="text-3xl font-semibold bg-gradient-to-r from-lime-300 to-emerald-300 bg-clip-text text-transparent">
              320+
            </p>
            <p className="text-xs text-gray-400 mt-2">Estimated from delivered surplus</p>
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
          className="glass-card lg:col-span-2 rounded-2xl border border-emerald-400/20 p-5 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
          whileHover={{ borderColor: 'rgba(16,185,129,0.4)', boxShadow: '0_0_30px_rgba(16,185,129,0.25)' }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-200">Recent Surplus Posts</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Track your food surplus submissions</p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-300 ring-1 ring-emerald-400/30">
              Live
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead>
                <tr className="border-b border-emerald-400/20 text-[11px] text-gray-400">
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
                    className="border-b border-emerald-400/10 text-[11px] transition-colors hover:bg-emerald-500/5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                  >
                    <td className="py-3 pr-4 font-medium text-gray-200">
                      {post.foodName}
                    </td>
                    <td className="py-3 pr-4 text-gray-300">{post.quantity}</td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="py-3 pr-4 text-gray-400">{post.createdAt}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        <motion.div
          className="glass-card rounded-2xl border border-cyan-400/20 p-5 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
          whileHover={{ borderColor: 'rgba(34,211,238,0.4)', boxShadow: '0_0_30px_rgba(34,211,238,0.25)' }}
          transition={{ duration: 0.3 }}
        >
          <p className="mb-3 text-sm font-semibold text-cyan-200">
            Weekly Surplus (kg)
          </p>
          <ChartComponent type="bar" data={weeklyData} dataKey="value" nameKey="name" />
        </motion.div>
      </motion.div>

      {/* Find Nearest NGO Section */}
      <motion.div
        className="glass-card space-y-4 rounded-2xl border border-emerald-400/20 p-6 shadow-[0_0_25px_rgba(16,185,129,0.2)]"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <div>
          <div className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-400/40 mb-3">
            <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
            AI-Powered Matching
          </div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
            Find Nearest NGO
          </h2>
          <p className="text-sm text-gray-400 mt-2">
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
                className="bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:bg-emerald-400"
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
                <p className="text-sm font-semibold text-emerald-200">
                  {aiRecommendation
                    ? `All ${ngos.length} NGO${ngos.length > 1 ? 's' : ''} nearby`
                    : `Found ${ngos.length} NGO${ngos.length > 1 ? 's' : ''} nearby`}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">Select an NGO to contact</p>
              </div>
              {!isAIServiceAvailable() && (
                <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-[10px] text-yellow-300 ring-1 ring-yellow-400/30">
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
            className="rounded-lg bg-yellow-500/10 border border-yellow-400/30 p-3 text-xs text-yellow-300 ring-1 ring-yellow-400/20"
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
