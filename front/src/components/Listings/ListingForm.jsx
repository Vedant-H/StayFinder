import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

const ListingForm = ({ isEditMode = false }) => {
  const { id } = useParams(); // For edit mode
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState(['']); // Array of image URLs
  const [amenities, setAmenities] = useState(['']); // Array of amenities
  const [maxGuests, setMaxGuests] = useState(1);
  const [bedrooms, setBedrooms] = useState(0);
  const [beds, setBeds] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [availableDates, setAvailableDates] = useState([]); // Simplified for now
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchListing = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/listings/${id}`);
          const data = res.data;
          setTitle(data.title);
          setDescription(data.description);
          setPricePerNight(data.pricePerNight);
          setLocation(data.location);
          setImages(data.images.length ? data.images : ['']);
          setAmenities(data.amenities.length ? data.amenities : ['']);
          setMaxGuests(data.maxGuests);
          setBedrooms(data.bedrooms || 0);
          setBeds(data.beds || 0);
          setBathrooms(data.bathrooms || 0);
          setAvailableDates(data.availableDates.map(date => new Date(date))); // Convert strings to Date objects
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to load listing for editing.');
          navigate('/host/dashboard'); // Redirect if listing not found or unauthorized
        } finally {
          setLoading(false);
        }
      };
      fetchListing();
    }
  }, [isEditMode, id, navigate]);

  const handleImageChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const handleAddImage = () => {
    setImages([...images, '']);
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages.length ? newImages : ['']); // Ensure at least one empty field
  };

  const handleAmenityChange = (index, value) => {
    const newAmenities = [...amenities];
    newAmenities[index] = value;
    setAmenities(newAmenities);
  };

  const handleAddAmenity = () => {
    setAmenities([...amenities, '']);
  };

  const handleRemoveAmenity = (index) => {
    const newAmenities = amenities.filter((_, i) => i !== index);
    setAmenities(newAmenities.length ? newAmenities : ['']); // Ensure at least one empty field
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validImages = images.filter(url => url.trim() !== '');
    const validAmenities = amenities.filter(amenity => amenity.trim() !== '');

    if (validImages.length === 0) {
      toast.error('Please add at least one image URL.');
      setLoading(false);
      return;
    }

    const listingData = {
      title,
      description,
      pricePerNight: Number(pricePerNight),
      location,
      images: validImages,
      amenities: validAmenities,
      maxGuests: Number(maxGuests),
      bedrooms: Number(bedrooms),
      beds: Number(beds),
      bathrooms: Number(bathrooms),
      availableDates: availableDates, // Already Date objects
    };

    try {
      if (isEditMode) {
        await api.put(`/listings/${id}`, listingData);
        toast.success('Listing updated successfully!');
      } else {
        await api.post('/listings', listingData);
        toast.success('Listing created successfully!');
      }
      navigate('/host/dashboard'); // Redirect to host dashboard after submission
    } catch (error) {
      const messages = error.response?.data?.errors
        ? error.response.data.errors.map(err => err.msg).join(', ')
        : error.response?.data?.message || 'Something went wrong';
      toast.error(messages);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="text-center text-xl mt-8">Loading listing details...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl my-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        {isEditMode ? 'Edit Listing' : 'Create New Listing'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="title" className="block text-gray-700 text-sm font-semibold mb-2">
              Title:
            </label>
            <input
              type="text"
              id="title"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-gray-700 text-sm font-semibold mb-2">
              Location:
            </label>
            <input
              type="text"
              id="location"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="pricePerNight" className="block text-gray-700 text-sm font-semibold mb-2">
              Price per Night ($):
            </label>
            <input
              type="number"
              id="pricePerNight"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={pricePerNight}
              onChange={(e) => setPricePerNight(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label htmlFor="maxGuests" className="block text-gray-700 text-sm font-semibold mb-2">
              Max Guests:
            </label>
            <input
              type="number"
              id="maxGuests"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              min="1"
              required
            />
          </div>
          <div>
            <label htmlFor="bedrooms" className="block text-gray-700 text-sm font-semibold mb-2">
              Bedrooms:
            </label>
            <input
              type="number"
              id="bedrooms"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              min="0"
            />
          </div>
          <div>
            <label htmlFor="beds" className="block text-gray-700 text-sm font-semibold mb-2">
              Beds:
            </label>
            <input
              type="number"
              id="beds"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={beds}
              onChange={(e) => setBeds(e.target.value)}
              min="0"
            />
          </div>
          <div>
            <label htmlFor="bathrooms" className="block text-gray-700 text-sm font-semibold mb-2">
              Bathrooms:
            </label>
            <input
              type="number"
              id="bathrooms"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              min="0"
              step="0.5"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 text-sm font-semibold mb-2">
            Description:
          </label>
          <textarea
            id="description"
            rows="5"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Image URLs:
          </label>
          {images.map((image, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="url"
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-2 bg-red-500 text-white rounded-r-md hover:bg-red-600 transition-colors duration-200"
                >
                  <MinusIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddImage}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 mt-2"
          >
            <PlusIcon className="h-5 w-5 mr-1" /> Add Image
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Amenities:
          </label>
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., WiFi, Kitchen, Parking"
                value={amenity}
                onChange={(e) => handleAmenityChange(index, e.target.value)}
              />
              {amenities.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveAmenity(index)}
                  className="p-2 bg-red-500 text-white rounded-r-md hover:bg-red-600 transition-colors duration-200"
                >
                  <MinusIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddAmenity}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 mt-2"
          >
            <PlusIcon className="h-5 w-5 mr-1" /> Add Amenity
          </button>
        </div>

        {/* Simplified availableDates for now. A proper calendar UI would be complex here. */}
        {/* You can add a text area for comma-separated dates or a more advanced date picker */}
        {/* For now, we'll keep it simple or omit from the form for initial prototype if it adds too much complexity */}
        {/*
        <div className="mb-6">
          <label htmlFor="availableDates" className="block text-gray-700 text-sm font-semibold mb-2">
            Available Dates (YYYY-MM-DD, comma-separated):
          </label>
          <input
            type="text"
            id="availableDates"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={availableDates.map(date => date.toISOString().split('T')[0]).join(', ')}
            onChange={(e) => setAvailableDates(e.target.value.split(',').map(dateStr => new Date(dateStr.trim())))}
            placeholder="2025-07-01, 2025-07-02"
          />
        </div>
        */}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Submitting...' : isEditMode ? 'Update Listing' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
};

export default ListingForm;