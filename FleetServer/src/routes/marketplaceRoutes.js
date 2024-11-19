const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');

router.use(auth);

router.get('/listings', marketplaceController.getListings);
router.get('/listings/:id', marketplaceController.getListing);
router.post('/listings', validation.createListing, marketplaceController.createListing);
router.put('/listings/:id', validation.updateListing, marketplaceController.updateListing);
router.delete('/listings/:id', marketplaceController.deleteListing);
router.get('/matches/vehicle/:vehicleId', marketplaceController.getMatchingListings);
router.post('/listings/:id/bid', validation.createBid, marketplaceController.createBid);

module.exports = router;