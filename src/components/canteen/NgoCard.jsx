import React from 'react';
import Button from '../ui/Button';

/**
 * NGO Card Component
 * Displays NGO information with contact details and call button
 */
const NgoCard = ({ ngo }) => {
  const handleCall = (phone) => {
    // Remove any spaces or special characters for tel: link
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    window.location.href = `tel:${cleanPhone}`;
  };

  return (
    <div className="card border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        {/* NGO Name and Distance */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-secondary">{ngo.name}</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">{ngo.distance || 'N/A'}</p>
          </div>
          <span className="text-[10px] text-primary bg-primary/10 px-2 py-1 rounded-full">
            {ngo.capacity || 'N/A'}
          </span>
        </div>

        {/* Address */}
        <div>
          <p className="text-[11px] text-gray-600 flex items-start gap-1">
            <span className="text-gray-400">📍</span>
            <span>{ngo.address}</span>
          </p>
        </div>

        {/* Contact Details */}
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-gray-400">👤</span>
            <span>{ngo.contactPerson}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-gray-400">📧</span>
            <a 
              href={`mailto:${ngo.email}`} 
              className="text-primary hover:underline"
            >
              {ngo.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-gray-400">📞</span>
            <a 
              href={`tel:${ngo.phone.replace(/[\s\-()]/g, '')}`} 
              className="text-primary hover:underline"
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
                className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
              >
                {specialty}
              </span>
            ))}
          </div>
        )}

        {/* Call Button */}
        <Button
          size="sm"
          className="w-full"
          onClick={() => handleCall(ngo.phone)}
        >
          📞 Call Now
        </Button>
      </div>
    </div>
  );
};

export default NgoCard;

