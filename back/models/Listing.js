const mongoose = require('mongoose');

const listingSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title for your listing'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Please add a price per night'],
      min: [0, 'Price per night cannot be negative'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    images: {
      type: [String], // Array of URLs
      required: [true, 'Please add at least one image URL'],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'A listing must have at least one image URL',
      },
    },
    amenities: {
      type: [String], // e.g., 'WiFi', 'Kitchen', 'Parking'
      default: [],
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    maxGuests: {
      type: Number,
      required: [true, 'Please specify the maximum number of guests'],
      min: [1, 'Maximum guests must be at least 1'],
    },
    bedrooms: {
      type: Number,
      min: [0, 'Bedrooms cannot be negative'],
      default: 0,
    },
    beds: {
      type: Number,
      min: [0, 'Beds cannot be negative'],
      default: 0,
    },
    bathrooms: {
      type: Number,
      min: [0, 'Bathrooms cannot be negative'],
      default: 0,
    },
    availableDates: {
      type: [Date], // For calendar availability, simple approach
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;