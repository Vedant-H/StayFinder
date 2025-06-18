import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import ListingCard from '../components/Listings/ListingCard';
import { toast } from 'react-toastify';

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get('/listings');
        setListings(res.data.listings);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch listings');
        toast.error(err.response?.data?.message || 'Failed to load listings');
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  if (loading) {
    return <div className="text-center text-xl mt-8">Loading listings...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-600 mt-8">Error: {error}</div>;
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Featured Stays</h1>
      {listings.length === 0 ? (
        <p className="text-center text-gray-600">No listings found. Be the first to add one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;