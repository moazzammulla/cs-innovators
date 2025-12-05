import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import { fetchNgoNearbySurplus } from '../../utils/api';

const NgODashboard = () => {
  const [surplusList, setSurplusList] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await fetchNgoNearbySurplus();
      setSurplusList(data);
    }
    load();
  }, []);

  const handleAccept = (item) => {
    toast.success(`Pickup accepted for ${item.foodName} (mock)`);
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
          {surplusList.map((item) => (
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
                  <StatusBadge status="Available" />
                </div>
              </div>
              <div className="flex flex-col gap-2 text-xs md:items-end">
                <Button size="sm" onClick={() => handleAccept(item)}>
                  ACCEPT PICKUP
                </Button>
                <p className="text-[11px] text-gray-400">AI-matched opportunity</p>
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <p className="mb-2 text-xs font-medium text-secondary">Map View (Placeholder)</p>
          <div className="flex h-52 items-center justify-center rounded-xl border border-dashed border-primary/30 bg-primary/5 text-[11px] text-primary">
            Interactive map coming soon...
          </div>
        </div>
      </div>
    </div>
  );
};

export default NgODashboard;
