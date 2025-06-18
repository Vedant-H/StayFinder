import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const HostDashboardPage = () => {
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const res = await api.get('/listings/my-listings');
        setMyListings(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch your listings');
        toast.error(err.response?.data?.message || 'Failed to load your listings');
      } finally {
        setLoading(false);
      }
    };
    fetchMyListings();
  }, []);

  const handleDeleteListing = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await api.delete(`/listings/${id}`);
        setMyListings(myListings.filter((listing) => listing._id !== id));
        toast.success('Listing deleted successfully!');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete listing.');
      }
    }
  };

  if (loading) {
    return <div className="text-center text-xl mt-8">Loading your listings...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-600 mt-8">Error: {error}</div>;
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Your Listings</h1>
      <div className="mb-6 text-center">
        <Link
          to="/host/listings/new"
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-200 shadow-md"
        >
          <PlusCircleIcon className="h-6 w-6 mr-2" /> Create New Listing
        </Link>
      </div>

      {myListings.length === 0 ? (
        <p className="text-center text-gray-600">You haven't created any listings yet. Click "Create New Listing" to get started!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Title</th>
                <th className="py-3 px-6 text-left">Location</th>
                <th className="py-3 px-6 text-left">Price/Night</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myListings.map((listing) => (
                <tr key={listing._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">{listing.title}</td>
                  <td className="py-4 px-6 text-gray-700">{listing.location}</td>
                  <td className="py-4 px-6 text-gray-700">${listing.pricePerNight}</td>
                  <td className="py-4 px-6 flex space-x-3">
                    <button
                      onClick={() => navigate(`/host/listings/edit/${listing._id}`)}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                      title="Edit Listing"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteListing(listing._id)}
                      className="text-red-600 hover:text-red-800 flex items-center"
                      title="Delete Listing"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HostDashboardPage;