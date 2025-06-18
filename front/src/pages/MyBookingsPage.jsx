import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { CalendarIcon, UserGroupIcon, CurrencyDollarIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await api.get('/bookings/my-bookings');
        setBookings(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch your bookings');
        toast.error(err.response?.data?.message || 'Failed to load your bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.put(`/bookings/${bookingId}/cancel`);
        setBookings(
          bookings.map((booking) =>
            booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
          )
        );
        toast.success('Booking cancelled successfully!');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to cancel booking.');
      }
    }
  };

  if (loading) {
    return <div className="text-center text-xl mt-8">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-600 mt-8">Error: {error}</div>;
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">You have no active bookings.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
            >
              {booking.listing?.images?.[0] && (
                <img
                  src={booking.listing.images[0]}
                  alt={booking.listing.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                  <Link to={`/listings/${booking.listing._id}`} className="text-blue-600 hover:underline">
                    {booking.listing?.title || 'Unknown Listing'}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-1 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                  Check-in: {format(new Date(booking.checkInDate), 'MMM dd, yyyy')}
                </p>
                <p className="text-gray-600 mb-1 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                  Check-out: {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}
                </p>
                <p className="text-gray-600 mb-1 flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-1 text-gray-500" />
                  Guests: {booking.numberOfGuests}
                </p>
                <p className="text-gray-800 font-bold text-lg flex items-center mt-2">
                  <CurrencyDollarIcon className="h-5 w-5 mr-1 text-green-600" />
                  Total Price: ${booking.totalPrice.toFixed(2)}
                </p>
                <p className={`mt-2 text-sm font-semibold ${
                  booking.status === 'confirmed' ? 'text-green-600' :
                  booking.status === 'pending' ? 'text-yellow-600' :
                  booking.status === 'cancelled' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  Status: {booking.status.toUpperCase()}
                </p>

                {booking.status === 'pending' && new Date(booking.checkInDate) > new Date() && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="mt-4 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <XCircleIcon className="h-5 w-5 mr-2" /> Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;