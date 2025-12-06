import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import AISuggestionsPanel from '../../components/ngo/AISuggestionsPanel';
import { fetchNgoNearbySurplus } from '../../utils/api';
import { createPickup } from '../../utils/surplusDataManager';
import { fadeInUp, staggerContainer } from '../../utils/motionPresets';

const NgODashboard = () => {
  const navigate = useNavigate();
  const [surplusList, setSurplusList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const data = await fetchNgoNearbySurplus();
      setSurplusList(data);
      setIsLoading(false);
    }
    load();
    
    // Refresh every 5 seconds to get new posts
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (item) => {
    try {
      const pickup = createPickup({
        surplusId: item.id,
        ngoId: 1, // Default NGO ID
        ngoName: 'HopeForAll', // Default NGO name
      });
      
      toast.success(`Pickup accepted for ${item.foodName}! Redirecting to tracking...`);
      
      // Update local state to remove accepted item
      setSurplusList((prev) => prev.filter((i) => i.id !== item.id));
      
      // Redirect to NGO pickup tracking after a short delay
      setTimeout(() => {
        navigate('/ngo/pickup-tracking');
      }, 1500);
    } catch (error) {
      console.error('Error accepting pickup:', error);
      toast.error('Failed to accept pickup. Please try again.');
    }
  };

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
            AI-Powered Dashboard • Real-time matching
          </div>
          <h1 className="bg-gradient-to-r from-emerald-300 via-lime-200 to-cyan-300 bg-clip-text text-3xl font-semibold leading-tight text-transparent md:text-4xl">
            NGO Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Browse nearby surplus food and accept pickups.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="grid gap-4 lg:grid-cols-3"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <div className="space-y-4 lg:col-span-2">
          {isLoading ? (
            <motion.div
              className="glass-card rounded-2xl border border-emerald-400/20 p-8 text-center shadow-[0_0_20px_rgba(16,185,129,0.15)]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
              <p className="mt-3 text-sm text-gray-300">Loading available surplus...</p>
            </motion.div>
          ) : surplusList.length === 0 ? (
            <motion.div
              className="glass-card rounded-2xl border border-emerald-400/20 p-8 text-center shadow-[0_0_20px_rgba(16,185,129,0.15)]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-sm text-gray-300">No surplus food available at the moment.</p>
              <p className="mt-2 text-xs text-gray-400">Check back later for new posts.</p>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {surplusList.map((item, idx) => (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
                  className="glass-card group relative overflow-hidden rounded-2xl border border-emerald-400/20 p-5 shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:border-emerald-400/40 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                  whileHover={{ y: -2 }}
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative z-10 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-base font-semibold text-emerald-200">{item.foodName}</p>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300 ring-1 ring-emerald-400/30">
                        AI-Matched
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mb-2">{item.canteen}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px]">
                      <span className="flex items-center gap-1 text-gray-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                        Qty: {item.quantity}
                      </span>
                      <span className="flex items-center gap-1 text-gray-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                        Distance: {item.distance}
                      </span>
                      <span className="flex items-center gap-1 text-gray-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />
                        Pickup by: {item.deadline}
                      </span>
                      <StatusBadge status={item.status === 'Available' ? 'Available' : item.status} />
                    </div>
                  </div>
                  <div className="relative z-10 flex flex-col gap-2 text-xs md:items-end">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="sm"
                        onClick={() => handleAccept(item)}
                        className="bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:bg-emerald-400"
                      >
                        ACCEPT PICKUP
                      </Button>
                    </motion.div>
                    <p className="text-[10px] text-emerald-300/70">AI-matched opportunity</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
        <div className="space-y-4">
          {/* AI Suggestions Panel */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <AISuggestionsPanel availableSurplus={surplusList} />
          </motion.div>

          {/* Map View */}
          <motion.div
            className="glass-card rounded-2xl border border-cyan-400/20 p-5 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            whileHover={{ borderColor: 'rgba(34,211,238,0.4)', boxShadow: '0_0_30px_rgba(34,211,238,0.25)' }}
          >
            <p className="mb-3 text-sm font-semibold text-cyan-200">Map View</p>
            <p className="mb-2 text-[11px] text-gray-400">Interactive map coming soon...</p>
            <div className="flex h-52 items-center justify-center rounded-xl border border-dashed border-cyan-400/30 bg-cyan-500/5 text-[11px] text-cyan-300">
              <div className="text-center">
                <div className="mb-2 text-2xl">🗺️</div>
                <p>Map integration</p>
                <p className="text-[10px] text-cyan-300/60">in development</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default NgODashboard;
