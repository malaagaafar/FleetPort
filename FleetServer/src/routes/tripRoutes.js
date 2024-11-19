const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');

router.use(auth);

router.get('/', tripController.getAllTrips);
router.get('/:id', tripController.getTrip);
router.post('/', validation.createTrip, tripController.createTrip);
router.put('/:id/status', validation.updateTripStatus, tripController.updateTripStatus);
router.get('/:id/analytics', tripController.getTripAnalytics);
router.get('/vehicle/:vehicleId', tripController.getVehicleTrips);
router.get('/driver/:driverId', tripController.getDriverTrips);

module.exports = router;