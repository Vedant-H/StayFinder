import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, differenceInDays } from 'date-fns';
import api from '../../api/axiosConfig';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BookingForm = ({ listing }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const nights = differenceInDays(checkOutDate, checkInDate);
      if (nights > 0) {
        setTotalPrice(nights * listing.pricePerNight);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  }, [checkInDate, checkOutDate, listing.pricePerNight]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please log in to book a listing.');
      navigate('/login');
      return;
    }

    if (!checkInDate || !checkOutDate) {
      toast.error('Please select both check-in and check-out dates.');
      return;
    }

    if (checkInDate >= checkOutDate) {
      toast.error('Check-out date must be after check-in date.');
      return;
    }

    if (numberOfGuests < 1 || numberOfGuests > listing.maxGuests) {
      toast.error(`Number of guests must be between 1 and ${listing.maxGuests}.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/bookings', {
        listingId: listing._id,
        checkInDate,
        checkOutDate,
        numberOfGuests,
      });
      toast.success('Booking created successfully!');
      setCheckInDate(null);
      setCheckOutDate(null);
      setNumberOfGuests(1);
      setTotalPrice(0);
      navigate('/my-bookings'); // Redirect to my bookings page
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isHostViewingOwnListing = isAuthenticated && user?._id === listing.host._id;

  if (isHostViewingOwnListing) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg shadow-sm">
        <p className="font-semibold mb-2">You are viewing your own listing.</p>
        <p>Bookings cannot be made for your own listings.</p>
        <div className="mt-4 flex flex-col space-y-2">
          <button
            onClick={() => navigate(`/host/listings/edit/${listing._id}`)}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Edit Listing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Book This Stay</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="checkInDate" className="block text-gray-700 text-sm font-semibold mb-2">
            Check-in Date:
          </label>
          <DatePicker
            id="checkInDate"
            selected={checkInDate}
            onChange={(date) => setCheckInDate(date)}
            selectsStart
            startDate={checkInDate}
            endDate={checkOutDate}
            minDate={new Date()} // Cannot select past dates
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            dateFormat="yyyy/MM/dd"
            placeholderText="Select check-in date"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="checkOutDate" className="block text-gray-700 text-sm font-semibold mb-2">
            Check-out Date:
          </label>
          <DatePicker
            id="checkOutDate"
            selected={checkOutDate}
            onChange={(date) => setCheckOutDate(date)}
            selectsEnd
            startDate={checkInDate}
            endDate={checkOutDate}
            minDate={checkInDate ? addDays(checkInDate, 1) : new Date()} // Check-out must be after check-in
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            dateFormat="yyyy/MM/dd"
            placeholderText="Select check-out date"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="numberOfGuests" className="block text-gray-700 text-sm font-semibold mb-2">
            Number of Guests:
          </label>
          <input
            type="number"
            id="numberOfGuests"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            min="1"
            max={listing.maxGuests}
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(Number(e.target.value))}
          />
        </div>

        {totalPrice > 0 && (
          <div className="mb-4 text-xl font-bold text-gray-800">
            Total Price: ${totalPrice.toFixed(2)}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
          disabled={isSubmitting || !isAuthenticated}
        >
          {isSubmitting ? 'Booking...' : 'Book Now'}
        </button>
        {!isAuthenticated && <p className="text-red-500 text-sm mt-2">Please login to book.</p>}
      </form>
    </div>
  );
};

export default BookingForm;