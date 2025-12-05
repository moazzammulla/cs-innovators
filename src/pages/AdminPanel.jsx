import React from 'react';
import StatusBadge from '../components/ui/StatusBadge';

const mockCanteens = [
  { id: 1, name: 'Green Leaf Canteen', status: 'Approved', pendingPosts: 3 },
  { id: 2, name: 'Campus Dining Hall', status: 'Pending', pendingPosts: 1 },
];

const mockNgos = [
  { id: 101, name: 'HopeForAll', status: 'Approved', capacity: '120 meals' },
  { id: 102, name: 'HungerFree', status: 'Pending', capacity: '80 meals' },
];

const AdminPanel = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-secondary">Admin Panel</h1>
        <p className="text-xs text-gray-500">
          Approve accounts and view a summary of the ecosystem.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <p className="mb-2 text-xs font-medium text-secondary">Canteens</p>
          <div className="space-y-2 text-xs">
            {mockCanteens.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-semibold text-secondary">{c.name}</p>
                  <p className="text-[11px] text-gray-500">
                    Pending posts: {c.pendingPosts}
                  </p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <p className="mb-2 text-xs font-medium text-secondary">NGOs</p>
          <div className="space-y-2 text-xs">
            {mockNgos.map((n) => (
              <div
                key={n.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-semibold text-secondary">{n.name}</p>
                  <p className="text-[11px] text-gray-500">
                    Pickup capacity: {n.capacity}
                  </p>
                </div>
                <StatusBadge status={n.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
