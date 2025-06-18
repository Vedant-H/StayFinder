import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, CurrencyDollarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const ListingCard = ({ listing }) => {
  return (
    <Link to={`/listings/${listing._id}`} className="block transform transition-transform duration-300 hover:scale-105">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">{listing.title}</h3>
          <p className="text-gray-600 flex items-center mb-1">
            <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
            {listing.location}
          </p>
          <div className="flex justify-between items-center mt-3">
            <p className="text-gray-800 font-bold text-lg flex items-center">
              <CurrencyDollarIcon className="h-5 w-5 mr-1 text-green-600" />
              {listing.pricePerNight} <span className="text-sm font-normal text-gray-500 ml-1">/ night</span>
            </p>
            <p className="text-gray-600 text-sm flex items-center">
                <UserGroupIcon className="h-4 w-4 mr-1 text-gray-500" />
                Max Guests: {listing.maxGuests}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;