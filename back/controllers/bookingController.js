const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Authenticated users)
const createBooking = asyncHandler(async (req, res) => {
  await body('listingId').notEmpty().withMessage('Listing ID is required').run(req);
  await body('checkInDate').isISO8601().toDate().withMessage('Valid check-in date is required').run(req);
  await body('checkOutDate').isISO8601().toDate().withMessage('Valid check-out date is required').run(req);
  await body('numberOfGuests')
    .isInt({ min: 1 })
    .withMessage('Number of guests must be at least 1')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { listingId, checkInDate, checkOutDate, numberOfGuests } = req.body;

  if (checkInDate >= checkOutDate) {
    res.status(400);
    throw new Error('Check-out date must be after check-in date');
  }

  const listing = await Listing.findById(listingId);

  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }

  if (numberOfGuests > listing.maxGuests) {
    res.status(400);
    throw new Error(`Number of guests exceeds the maximum allowed for this listing (${listing.maxGuests})`);
  }

  // Simple availability check:
  // Check if any existing booking for this listing overlaps with the requested dates.
  const overlappingBookings = await Booking.find({
    listing: listingId,
    status: { $in: ['pending', 'confirmed'] }, // Consider pending and confirmed bookings as occupied
    $or: [
      {
        checkInDate: { $lt: checkOutDate },
        checkOutDate: { $gt: checkInDate },
      },
    ],
  });

  if (overlappingBookings.length > 0) {
    res.status(400);
    throw new Error('Selected dates are not available');
  }

  // Calculate total price (number of nights * price per night)
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const diffDays = Math.round(Math.abs((checkOutDate - checkInDate) / oneDay));
  const totalPrice = diffDays * listing.pricePerNight;

  const booking = new Booking({
    listing: listingId,
    user: req.user._id,
    checkInDate,
    checkOutDate,
    totalPrice,
    numberOfGuests,
    status: 'pending', // Default status
  });

  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
});

// @desc    Get all bookings for the currently authenticated user
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate({
    path: 'listing',
    select: 'title location images pricePerNight', // Select relevant listing details
  });
  res.json(bookings);
});

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
// @access  Private (User who made booking or host of listing)
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate({
    path: 'listing',
    populate: { path: 'host', select: 'username' }, // Populate host of the listing
    select: 'title location pricePerNight images',
  });

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if the authenticated user is the one who made the booking OR is the host of the listing
  if (
    booking.user.toString() !== req.user._id.toString() &&
    booking.listing.host.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to view this booking');
  }

  res.json(booking);
});

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (User who made booking)
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if the authenticated user is the one who made the booking
  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }

  if (booking.status === 'cancelled' || booking.status === 'completed') {
    res.status(400);
    throw new Error(`Booking already ${booking.status}`);
  }

  // You might want to add logic here to prevent cancellation too close to check-in date
  // For now, allow cancellation if not already cancelled/completed
  booking.status = 'cancelled';
  await booking.save();

  res.json({ message: 'Booking cancelled successfully', booking });
});

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};