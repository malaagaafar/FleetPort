const express = require('express');
const router = express.Router();
const deviceAssignmentController = require('../controllers/deviceAssignmentController');
//const auth = require('../middleware/auth');

//router.use(auth);

router.get('/vehicle-device/:vehicleId', deviceAssignmentController.getVehicleDevice);

module.exports = router; 