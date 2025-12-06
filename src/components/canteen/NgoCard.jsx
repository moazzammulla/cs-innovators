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
    <div className="glass-card group relative overflow-hidden rounded-2xl border border-emerald-400/20 p-4 shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:border-emerald-400/40">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative z-10 space-y-3">
        {/* NGO Name and Distance */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 
              className="text-sm font-semibold text-emerald-200 cursor-pointer hover:text-emerald-100 transition-colors"
              onClick={handleNameClick}
            >
              {ngo.name}
            </h3>
            <p className="text-[11px] text-emerald-300/70 mt-0.5 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              {ngo.distance || 'N/A'}
            </p>
          </div>
          <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded-full ring-1 ring-emerald-400/30">
            {ngo.capacity || 'N/A'}
          </span>
        </div>

        {/* Address */}
        <div>
          <p className="text-[11px] text-gray-300 flex items-start gap-1">
            <span className="text-emerald-300">📍</span>
            <span>{ngo.address}</span>
          </p>
        </div>

        {/* Contact Details */}
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-emerald-300">👤</span>
            <span>{ngo.contactPerson}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-emerald-300">📧</span>
            <a 
              href={`mailto:${ngo.email}`} 
              className="text-emerald-300 hover:text-emerald-200 hover:underline transition-colors"
            >
              {ngo.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-emerald-300">📞</span>
            <a 
              href={`tel:${ngo.phone.replace(/[\s\-()]/g, '')}`} 
              className="text-emerald-300 hover:text-emerald-200 hover:underline transition-colors"
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
                className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-full ring-1 ring-emerald-400/20"
              >
                {specialty}
              </span>
            ))}
          </div>
        )}

        {/* Call Button */}
        <Button
          size="sm"
          className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          onClick={() => handleCall(ngo.phone)}
        >
          📞 Call Now
        </Button>
      </div>
    </div>
  );
};

export default NgoCard;

