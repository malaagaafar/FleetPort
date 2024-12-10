const express = require('express');
const router = express.Router();
const geofenceController = require('../controllers/geofenceController');
const { authenticateToken } = require('../middleware/auth');

router.post('/', geofenceController.createGeofence);
router.get('/all', geofenceController.getAllGeofences);
router.get('/:id', geofenceController.getGeofenceById);
router.put('/:id', geofenceController.updateGeofence);
router.delete('/:id', geofenceController.deleteGeofence);

module.exports = router; 