import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import AISuggestionsPanel from '../../components/ngo/AISuggestionsPanel';
import { fetchNgoNearbySurplus } from '../../utils/api';
import { createPickup } from '../../utils/surplusDataManager';

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
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-xl font-semibold text-secondary">NGO Dashboard</h1>
          <p className="text-xs text-gray-500">
            Browse nearby surplus food and accept pickups.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {isLoading ? (
            <div className="card p-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="mt-3 text-xs text-gray-500">Loading available surplus...</p>
            </div>
          ) : surplusList.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-sm text-gray-600">No surplus food available at the moment.</p>
              <p className="mt-2 text-xs text-gray-500">Check back later for new posts.</p>
            </div>
          ) : (
            surplusList.map((item) => (
            <div
              key={item.id}
              className="card flex flex-col gap-3 border border-gray-50 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-secondary">{item.foodName}</p>
                <p className="text-xs text-gray-500">{item.canteen}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
                  <span>Qty: {item.quantity}</span>
                  <span>Distance: {item.distance}</span>
                  <span>Pickup by: {item.deadline}</span>
                  <StatusBadge status={item.status === 'Available' ? 'Available' : item.status} />
                </div>
              </div>
              <div className="flex flex-col gap-2 text-xs md:items-end">
                <Button size="sm" onClick={() => handleAccept(item)}>
                  ACCEPT PICKUP
                </Button>
                <p className="text-[11px] text-gray-400">AI-matched opportunity</p>
              </div>
            </div>
            ))
          )}
        </div>
        <div className="space-y-4">
          {/* AI Suggestions Panel */}
          <AISuggestionsPanel availableSurplus={surplusList} />

          {/* Map View */}
          <div className="card">
            <p className="mb-2 text-xs font-medium text-secondary">Map View (Placeholder)</p>
            <div className="flex h-52 items-center justify-center rounded-xl border border-dashed border-primary/30 bg-primary/5 text-[11px] text-primary">
              Interactive map coming soon...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NgODashboard;
