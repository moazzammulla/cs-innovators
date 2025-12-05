import React from 'react';
import StatusBadge from '../components/ui/StatusBadge';
import { trackingSteps } from '../utils/mockData';

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
  // Current step index (0-3). For demo we set to 2 (Picked Up)
  const currentStepIndex = 2;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-secondary">Pickup Tracking</h1>
        <p className="text-xs text-gray-500">
          Track the lifecycle of a surplus food post from creation to delivery.
        </p>
      </div>

      <div className="card space-y-4">
        <div className="flex flex-col gap-2 text-xs md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-secondary">Veg Pulao - 25 portions</p>
            <p className="text-[11px] text-gray-500">Posted by Green Leaf Canteen</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <StatusBadge status={trackingSteps[currentStepIndex]} />
            <span className="rounded-full bg-primary/5 px-2 py-1 text-primary">
              ETA: 25 mins
            </span>
          </div>
        </div>

        <Stepper currentStepIndex={currentStepIndex} />
      </div>

      <div className="grid gap-4 text-xs md:grid-cols-2">
        <div className="card space-y-2">
          <p className="text-xs font-medium text-secondary">Timeline</p>
          <ul className="space-y-2 text-[11px] text-gray-600">
            <li>
              <span className="font-semibold text-secondary">Posted</span> · Today 5:00 PM
            </li>
            <li>
              <span className="font-semibold text-secondary">NGO Assigned</span> · Today
              5:10 PM (HopeForAll)
            </li>
            <li>
              <span className="font-semibold text-secondary">Picked Up</span> · Today 5:40
              PM
            </li>
            <li>
              <span className="font-semibold text-gray-400">Delivered</span> · Pending
            </li>
          </ul>
        </div>
        <div className="card space-y-2">
          <p className="text-xs font-medium text-secondary">NGO & Route Details</p>
          <p className="text-[11px] text-gray-600">
            <span className="font-semibold">NGO:</span> HopeForAll
          </p>
          <p className="text-[11px] text-gray-600">
            <span className="font-semibold">Pickup Location:</span> Green Leaf Canteen,
            City Center
          </p>
          <p className="text-[11px] text-gray-600">
            <span className="font-semibold">Drop Location:</span> Community Shelter #12
          </p>
        </div>
      </div>
    </div>
  );
};

export default PickupTrackingPage;
