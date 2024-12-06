const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const locationService = require('../services/locationService');

// نعود للصيغة الأصلية التي كانت تعمل
router.get('/vehicle-locations', locationController.getVehicleLocations);

router.get('/address', async (req, res) => {
    try {
        const { latitude, longitude } = req.query;
        const address = await locationService.getAddressFromCoordinates(latitude, longitude);
        res.json({ address });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;