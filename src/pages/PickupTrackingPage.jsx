import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import { trackingSteps } from '../utils/mockData';
import { getActivePickups, updatePickupStatus } from '../utils/surplusDataManager';
import toast from 'react-hot-toast';

const Stepper = ({ currentStepIndex }) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {trackingSteps.map((step, index) => {
        const isActive = index <= currentStepIndex;
        return (
          <div key={step} className="flex flex-1 items-center md:flex-col">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1}
            </div>
            <div className="ml-2 flex-1 text-xs md:ml-0 md:mt-2">
              <p
                className={`font-medium ${
                  isActive ? 'text-secondary' : 'text-gray-500'
                }`}
              >
                {step}
              </p>
            </div>
            {index < trackingSteps.length - 1 && (
              <div className="hidden flex-1 border-t border-dashed border-gray-300 md:block" />
            )}
          </div>
        );
      })}
    </div>
  );
};

const PickupTrackingPage = () => {
  const location = useLocation();
  const [pickups, setPickups] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState(null);

  // Determine user role from current path
  const userRole = location.pathname.includes('/ngo/') ? 'ngo' : 'canteen';

  useEffect(() => {
    // Check if we have a new pickup from navigation state
    if (location.state?.newPickup) {
      const newPickup = location.state.newPickup;
      setPickups([newPickup]);
      setSelectedPickup(newPickup);
      // Clear the state to avoid re-using it
      window.history.replaceState({}, document.title);
    } else {
      // Load from localStorage
      loadPickups();
    }
    
    // Also refresh when component becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadPickups();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Refresh every 3 seconds
    const interval = setInterval(loadPickups, 3000);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname, location.state]);

  const loadPickups = () => {
    try {
      const activePickups = getActivePickups();
      setPickups(activePickups);
      
      // Auto-select first pickup if none selected, or if current selection is no longer in list
      setSelectedPickup((currentSelected) => {
        if (activePickups.length > 0) {
          if (!currentSelected || !activePickups.find(p => p.id === currentSelected.id)) {
            return activePickups[0];
          } else {
            // Update selected pickup with latest data
            const updated = activePickups.find(p => p.id === currentSelected.id);
            return updated || currentSelected;
          }
        } else {
          return null;
        }
      });
    } catch (error) {
      console.warn('Error loading pickups:', error);
      // Continue with empty list if there's an error
      setPickups([]);
      setSelectedPickup(null);
    }
  };

  const getCurrentStepIndex = (status) => {
    const statusMap = {
      'Posted': 0,
      'NGO Assigned': 1,
      'Picked Up': 2,
      'Delivered': 3,
    };
    return statusMap[status] || 0;
  };

  const handleStatusUpdate = async (pickupId, newStatus) => {
    try {
      updatePickupStatus(pickupId, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      loadPickups();
      // Update selected pickup if it's the one being updated
      if (selectedPickup?.id === pickupId) {
        const updated = getActivePickups().find((p) => p.id === pickupId);
        setSelectedPickup(updated || null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const currentPickup = selectedPickup || pickups[0];
  const currentStepIndex = currentPickup ? getCurrentStepIndex(currentPickup.status) : 0;

  if (pickups.length === 0) {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-secondary">Pickup Tracking</h1>
          <p className="text-xs text-gray-500">
            Track the lifecycle of a surplus food post from creation to delivery.
          </p>
        </div>
        <div className="card p-8 text-center">
          <p className="text-sm text-gray-600">No active pickups at the moment.</p>
          <p className="mt-2 text-xs text-gray-500">
            {userRole === 'ngo'
              ? 'Accept a pickup from the NGO Dashboard to start tracking.'
              : 'Surplus food posts will appear here once NGOs accept them.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-secondary">Pickup Tracking</h1>
        <p className="text-xs text-gray-500">
          Track the lifecycle of a surplus food post from creation to delivery.
          {userRole === 'ngo' && ' (You can mark pickups as "Picked Up")'}
          {userRole === 'canteen' && ' (You can mark pickups as "Delivered")'}
        </p>
      </div>

      {/* Pickup List */}
      {pickups.length > 1 && (
        <div className="card space-y-2">
          <p className="text-xs font-medium text-secondary mb-2">Active Pickups</p>
          <div className="space-y-2">
            {pickups.map((pickup) => (
              <button
                key={pickup.id}
                onClick={() => setSelectedPickup(pickup)}
                className={`w-full rounded-lg border p-3 text-left text-xs transition ${
                  selectedPickup?.id === pickup.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-secondary">
                      {pickup.foodName} - {pickup.quantity}
                    </p>
                    <p className="text-[11px] text-gray-500">{pickup.canteen}</p>
                  </div>
                  <StatusBadge status={pickup.status} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Pickup Details */}
      {currentPickup && (
        <>
          <div className="card space-y-4">
            <div className="flex flex-col gap-2 text-xs md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-secondary">
                  {currentPickup.foodName} - {currentPickup.quantity}
                </p>
                <p className="text-[11px] text-gray-500">
                  Posted by {currentPickup.canteen}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <StatusBadge status={currentPickup.status} />
              </div>
            </div>

            <Stepper currentStepIndex={currentStepIndex} />

            {/* Action Buttons - Role-based permissions */}
            <div className="flex gap-2 pt-2">
              {/* NGO can only mark as "Picked Up" when status is "NGO Assigned" */}
              {userRole === 'ngo' && currentPickup.status === 'NGO Assigned' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(currentPickup.id, 'Picked Up')}
                  className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg shadow-green-200/50 hover:from-green-600 hover:to-teal-600"
                >
                  Mark as Picked Up
                </Button>
              )}
              
              {/* Canteen can only mark as "Delivered" when status is "Picked Up" */}
              {userRole === 'canteen' && currentPickup.status === 'Picked Up' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(currentPickup.id, 'Delivered')}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-200/50 hover:from-blue-600 hover:to-purple-600"
                >
                  Mark as Delivered
                </Button>
              )}

              {/* Show message when no action available */}
              {((userRole === 'ngo' && currentPickup.status !== 'NGO Assigned') ||
                (userRole === 'canteen' && currentPickup.status !== 'Picked Up')) && (
                <div className="flex-1 rounded-lg bg-gray-50 p-2 text-center text-[11px] text-gray-500">
                  {userRole === 'ngo'
                    ? 'Waiting for pickup to be assigned...'
                    : currentPickup.status === 'NGO Assigned'
                    ? 'Waiting for NGO to pick up...'
                    : currentPickup.status === 'Delivered'
                    ? 'Pickup completed!'
                    : 'No action available'}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 text-xs md:grid-cols-2">
            <div className="card space-y-2">
              <p className="text-xs font-medium text-secondary">Timeline</p>
              <ul className="space-y-2 text-[11px] text-gray-600">
                {currentPickup.statusTimeline?.map((event, idx) => (
                  <li key={idx}>
                    <span
                      className={`font-semibold ${
                        idx <= currentStepIndex ? 'text-secondary' : 'text-gray-400'
                      }`}
                    >
                      {event.status}
                    </span>
                    {' · '}
                    {new Date(event.at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                    {event.description && (
                      <span className="text-gray-500"> ({event.description})</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card space-y-2">
              <p className="text-xs font-medium text-secondary">NGO & Route Details</p>
              <p className="text-[11px] text-gray-600">
                <span className="font-semibold">NGO:</span> {currentPickup.ngoName}
              </p>
              <p className="text-[11px] text-gray-600">
                <span className="font-semibold">Pickup Location:</span> {currentPickup.canteen}
              </p>
              <p className="text-[11px] text-gray-600">
                <span className="font-semibold">Quantity:</span> {currentPickup.quantity}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PickupTrackingPage;
