const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.post('/driver-vehicles', assignmentController.driverVehiclesAssignment);
router.get('/assigned-driver-vehicles', assignmentController.getDriversAssignment);
module.exports = router; 