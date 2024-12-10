const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');
//const auth = require('../middleware/auth');

//router.use(auth);

router.get('/', positionController.getVehiclePositions);

module.exports = router; 