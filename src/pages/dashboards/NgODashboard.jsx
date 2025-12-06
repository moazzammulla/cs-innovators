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

  const loadSurplusData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchNgoNearbySurplus();
      setSurplusList(data);
    } catch (error) {
      console.error('Error loading surplus data:', error);
      toast.error('Failed to load surplus posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSurplusData();
    
    // Refresh data when component gains focus (user switches back to tab)
    const handleFocus = () => {
      loadSurplusData();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleAccept = async (item) => {
    try {
      // Create pickup record with all necessary data
      const pickup = await createPickup({
        surplusId: item.id,
        ngoId: 1,
        ngoName: 'HopeForAll',
        foodName: item.foodName,
        quantity: item.quantity,
        canteen: item.canteen || 'Green Leaf Canteen',
      });
      
      toast.success(`Pickup accepted for ${item.foodName}! Redirecting to tracking...`);
      
      // Update local state to remove accepted item
      setSurplusList((prev) => prev.filter((i) => i.id !== item.id));
      
      // Navigate immediately - the pickup tracking page will load the data
      navigate('/ngo/pickup-tracking', { 
        replace: true,
        state: { newPickup: pickup } // Pass pickup data via navigation state
      });
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
          <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-[11px] font-medium text-green-600 ring-1 ring-green-200 mb-2">
            <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            AI-Powered Dashboard • Real-time matching
          </div>
          <h1 className="bg-gradient-to-r from-green-600 via-teal-600 to-emerald-600 bg-clip-text text-3xl font-semibold leading-tight text-transparent md:text-4xl">
            NGO Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Browse nearby surplus food and accept pickups.
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            onClick={loadSurplusData}
            disabled={isLoading}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg shadow-green-200/50 hover:from-green-600 hover:to-teal-600 disabled:opacity-50"
          >
            {isLoading ? '🔄 Loading...' : '🔄 Refresh'}
          </Button>
        </motion.div>
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
              className="bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-green-300/60 p-8 text-center shadow-lg shadow-green-200/60"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
              <p className="mt-3 text-sm text-slate-700 font-medium">Loading available surplus...</p>
            </motion.div>
          ) : surplusList.length === 0 ? (
            <motion.div
              className="bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-green-300/60 p-8 text-center shadow-lg shadow-green-200/60"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-sm text-slate-700 font-medium">No surplus food available at the moment.</p>
              <p className="mt-2 text-xs text-slate-600">Check back later for new posts.</p>
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
                  className="bg-white/95 backdrop-blur-sm group relative overflow-hidden rounded-2xl border-2 border-green-300/60 p-5 shadow-lg shadow-green-200/60 transition-all hover:shadow-xl hover:shadow-green-300/80 hover:border-green-400 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                  whileHover={{ y: -2 }}
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-green-100 blur-2xl opacity-0 transition-opacity group-hover:opacity-50" />
                  <div className="relative z-10 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-lg font-bold text-slate-800">{item.foodName}</p>
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 ring-1 ring-green-300">
                        AI-Matched
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-700 mb-2">{item.canteen}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px]">
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Qty: {item.quantity}
                      </span>
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                        Distance: {item.distance}
                      </span>
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
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
                        className="bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg shadow-green-200/50 hover:from-green-600 hover:to-teal-600"
                      >
                        ACCEPT PICKUP
                      </Button>
                    </motion.div>
                    <p className="text-[10px] text-green-600/70">AI-matched opportunity</p>
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
        </div>
      </motion.div>
    </div>
  );
};

export default NgODashboard;
