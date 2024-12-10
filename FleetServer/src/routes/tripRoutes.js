const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
//const auth = require('../middleware/auth');

// تطبيق middleware المصادقة على جميع الطرق
//router.use(auth);

// طرق الرحلات
router.get('/', tripController.getAllTrips);
router.post('/', tripController.createTrip);

// طرق جلب المركبات والسائقين للتعيين
router.get('/vehicles/for-assignment', tripController.getVehiclesForAssignment);
router.get('/drivers/for-assignment', tripController.getDriversForAssignment);

module.exports = router;