import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

/**
 * NGO Card Component
 * Displays NGO information with contact details and call button
 */
const NgoCard = ({ ngo }) => {
  const navigate = useNavigate();

  const handleNameClick = () => {
    // Redirect to add surplus food form when clicking NGO name
    navigate('/canteen/add-surplus');
  };

  const handleCall = (phone) => {
    // Remove any spaces or special characters for tel: link
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    window.location.href = `tel:${cleanPhone}`;
  };

  return (
    <div className="bg-white group relative overflow-hidden rounded-2xl border border-blue-200 p-4 shadow-md shadow-blue-100/50 transition-all hover:shadow-lg hover:shadow-blue-200/70 hover:border-blue-300">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100 blur-2xl opacity-0 transition-opacity group-hover:opacity-50" />
      <div className="relative z-10 space-y-3">
        {/* NGO Name and Distance */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 
              className="text-sm font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={handleNameClick}
            >
              {ngo.name}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              {ngo.distance || 'N/A'}
            </p>
          </div>
          <span className="text-[10px] text-blue-600 bg-blue-100 px-2 py-1 rounded-full ring-1 ring-blue-200">
            {ngo.capacity || 'N/A'}
          </span>
        </div>

        {/* Address */}
        <div>
          <p className="text-[11px] text-slate-600 flex items-start gap-1">
            <span className="text-blue-500">📍</span>
            <span>{ngo.address}</span>
          </p>
        </div>

        {/* Contact Details */}
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-blue-500">👤</span>
            <span>{ngo.contactPerson}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-blue-500">📧</span>
            <a 
              href={`mailto:${ngo.email}`} 
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              {ngo.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-blue-500">📞</span>
            <a 
              href={`tel:${ngo.phone.replace(/[\s\-()]/g, '')}`} 
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              {ngo.phone}
            </a>
          </div>
        </div>

        {/* Specialties */}
        {ngo.specialties && ngo.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {ngo.specialties.map((specialty, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full ring-1 ring-blue-200"
              >
                {specialty}
              </span>
            ))}
          </div>
        )}

        {/* Call Button */}
        <Button
          size="sm"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-200/50 hover:from-blue-600 hover:to-purple-600"
          onClick={() => handleCall(ngo.phone)}
        >
          📞 Call Now
        </Button>
      </div>
    </div>
  );
};

export default NgoCard;

