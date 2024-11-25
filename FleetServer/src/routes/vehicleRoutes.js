const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
//const auth = require('../middleware/auth');

//router.use(auth);

//router.get('/', vehicleController.getAllVehicles);
//router.get('/:id', vehicleController.getVehicle);
router.post('/', vehicleController.createVehicle);
//router.put('/:id', vehicleController.updateVehicle);
//router.delete('/:id', vehicleController.deleteVehicle);
//router.get('/:id/location', vehicleController.getVehicleLocation);


module.exports = router;