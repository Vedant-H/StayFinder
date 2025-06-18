const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Listing = require('../models/Listing');

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
const getListings = asyncHandler(async (req, res) => {
  const pageSize = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * pageSize;

  const listings = await Listing.find({})
    .limit(pageSize)
    .skip(skip)
    .populate('host', 'username email'); // Populate host details

  const count = await Listing.countDocuments();

  res.json({
    listings,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get single listing by ID
// @route   GET /api/listings/:id
// @access  Public
const getListingById = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate(
    'host',
    'username email'
  );

  if (listing) {
    res.json(listing);
  } else {
    res.status(404);
    throw new Error('Listing not found');
  }
});

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private (Host only)
const createListing = asyncHandler(async (req, res) => {
  // Validate request body
  await body('title').notEmpty().withMessage('Title is required').run(req);
  await body('description').notEmpty().withMessage('Description is required').run(req);
  await body('pricePerNight')
    .isFloat({ min: 0 })
    .withMessage('Price per night must be a positive number')
    .run(req);
  await body('location').notEmpty().withMessage('Location is required').run(req);
  await body('images')
    .isArray({ min: 1 })
    .withMessage('At least one image URL is required')
    .custom((value) => value.every(url => typeof url === 'string' && url.startsWith('http')))
    .withMessage('All images must be valid URLs')
    .run(req);
  await body('maxGuests')
    .isInt({ min: 1 })
    .withMessage('Max guests must be at least 1')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    title,
    description,
    pricePerNight,
    location,
    images,
    amenities,
    maxGuests,
    bedrooms,
    beds,
    bathrooms,
    availableDates,
  } = req.body;

  const listing = new Listing({
    title,
    description,
    pricePerNight,
    location,
    images,
    amenities: amenities || [],
    host: req.user._id, // Host is the authenticated user
    maxGuests,
    bedrooms: bedrooms || 0,
    beds: beds || 0,
    bathrooms: bathrooms || 0,
    availableDates: availableDates || [],
  });

  const createdListing = await listing.save();
  res.status(201).json(createdListing);
});

// @desc    Update a listing by ID
// @route   PUT /api/listings/:id
// @access  Private (Host owner only)
const updateListing = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    pricePerNight,
    location,
    images,
    amenities,
    maxGuests,
    bedrooms,
    beds,
    bathrooms,
    availableDates,
  } = req.body;

  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }

  // Check if the authenticated user is the host of this listing
  if (listing.host.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this listing');
  }

  // Validate fields if they are provided
  if (title !== undefined) await body('title').notEmpty().withMessage('Title cannot be empty').run(req);
  if (description !== undefined) await body('description').notEmpty().withMessage('Description cannot be empty').run(req);
  if (pricePerNight !== undefined) await body('pricePerNight').isFloat({ min: 0 }).withMessage('Price per night must be a positive number').run(req);
  if (location !== undefined) await body('location').notEmpty().withMessage('Location cannot be empty').run(req);
  if (images !== undefined) await body('images').isArray({ min: 1 }).withMessage('At least one image URL is required').custom((value) => value.every(url => typeof url === 'string' && url.startsWith('http'))).withMessage('All images must be valid URLs').run(req);
  if (maxGuests !== undefined) await body('maxGuests').isInt({ min: 1 }).withMessage('Max guests must be at least 1').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  listing.title = title || listing.title;
  listing.description = description || listing.description;
  listing.pricePerNight = pricePerNight || listing.pricePerNight;
  listing.location = location || listing.location;
  listing.images = images || listing.images;
  listing.amenities = amenities !== undefined ? amenities : listing.amenities;
  listing.maxGuests = maxGuests || listing.maxGuests;
  listing.bedrooms = bedrooms !== undefined ? bedrooms : listing.bedrooms;
  listing.beds = beds !== undefined ? beds : listing.beds;
  listing.bathrooms = bathrooms !== undefined ? bathrooms : listing.bathrooms;
  listing.availableDates = availableDates !== undefined ? availableDates : listing.availableDates;

  const updatedListing = await listing.save();
  res.json(updatedListing);
});

// @desc    Delete a listing by ID
// @route   DELETE /api/listings/:id
// @access  Private (Host owner only)
const deleteListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }

  // Check if the authenticated user is the host of this listing
  if (listing.host.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this listing');
  }

  await Listing.deleteOne({ _id: req.params.id });
  res.json({ message: 'Listing removed' });
});

// @desc    Get listings for the current host
// @route   GET /api/listings/my-listings
// @access  Private (Host only)
const getMyListings = asyncHandler(async (req, res) => {
  const listings = await Listing.find({ host: req.user._id });
  res.json(listings);
});

module.exports = {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
};