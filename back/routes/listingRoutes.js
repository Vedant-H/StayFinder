const express = require('express');
const router = express.Router();
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
} = require('../controllers/listingController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.route('/')
  .get(getListings)
  .post(protect, authorizeRoles('host'), createListing);

router.route('/my-listings')
  .get(protect, authorizeRoles('host'), getMyListings);

router.route('/:id')
  .get(getListingById)
  .put(protect, authorizeRoles('host'), updateListing)
  .delete(protect, authorizeRoles('host'), deleteListing);

module.exports = router;