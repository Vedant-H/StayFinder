const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    checkInDate: {
      type: Date,
      required: [true, 'Please provide a check-in date'],
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Please provide a check-out date'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative'],
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Please specify the number of guests'],
      min: [1, 'Number of guests must be at least 1'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Custom validation to ensure checkOutDate is after checkInDate
bookingSchema.path('checkOutDate').validate(function (value) {
  return this.checkInDate < value;
}, 'Check-out date must be after check-in date');

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;