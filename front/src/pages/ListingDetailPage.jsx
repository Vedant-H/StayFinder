import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import BookingForm from '../components/Listings/BookingForm';
import { MapPinIcon, CurrencyDollarIcon, UserGroupIcon, WrenchScrewdriverIcon, HomeIcon, SwatchIcon } from '@heroicons/react/24/outline'; // Using generic icons for now. You might need to install '@heroicons/react'
import { toast } from 'react-toastify';

const ListingDetailPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch listing details');
        toast.error(err.response?.data?.message || 'Failed to load listing details');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) {
    return <div className="text-center text-xl mt-8">Loading listing details...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-600 mt-8">Error: {error}</div>;
  }

  if (!listing) {
    return <div className="text-center text-xl mt-8">Listing not found.</div>;
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === listing.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? listing.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 my-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{listing.title}</h1>
      <p className="text-gray-600 text-lg flex items-center mb-6">
        <MapPinIcon className="h-6 w-6 mr-2 text-gray-500" />
        {listing.location}
      </p>

      {/* Image Carousel */}
      <div className="relative mb-8 h-96 overflow-hidden rounded-lg">
        <img
          src={listing.images[currentImageIndex]}
          alt={listing.title}
          className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
        />
        {listing.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
            >
              &#10094;
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
            >
              &#10095;
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Listing Details */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Description</h2>
          <p className="text-gray-700 leading-relaxed mb-6">{listing.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center text-gray-700">
              <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-600" />
              <span className="font-semibold text-lg">{listing.pricePerNight}</span> / night
            </div>
            <div className="flex items-center text-gray-700">
              <UserGroupIcon className="h-5 w-5 mr-2 text-blue-600" />
              Max Guests: {listing.maxGuests}
            </div>
            {listing.bedrooms > 0 && (
              <div className="flex items-center text-gray-700">
                <HomeIcon className="h-5 w-5 mr-2 text-yellow-600" />
                Bedrooms: {listing.bedrooms}
              </div>
            )}
            {listing.beds > 0 && (
              <div className="flex items-center text-gray-700">
                <HomeIcon className="h-5 w-5 mr-2 text-purple-600" />
                Beds: {listing.beds}
              </div>
            )}
            {listing.bathrooms > 0 && (
              <div className="flex items-center text-gray-700">
                <SwatchIcon className="h-5 w-5 mr-2 text-teal-600" />
                Bathrooms: {listing.bathrooms}
              </div>
            )}
          </div>

          {listing.amenities && listing.amenities.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Amenities</h2>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                {listing.amenities.map((amenity, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-indigo-500" /> {amenity}
                  </li>
                ))}
              </ul>
            </>
          )}

          <h2 className="text-2xl font-bold text-gray-800 mb-3">Host Information</h2>
          <p className="text-gray-700">Hosted by: <span className="font-semibold">{listing.host?.username || 'N/A'}</span></p>
        </div>

        {/* Booking Form */}
        <div className="md:col-span-1">
          <BookingForm listing={listing} />
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;