/*const express = require('express');
const router = express.Router();
const deviceCatalogController = require('../controllers/deviceCatalogcontroller');
const { authenticateToken } = require('../middleware/auth');

// المسارات الحالية
router.get('/devices', authenticateToken, deviceCatalogController.getAvailableDevices);

// المسارات الجديدة
router.get('/devices/:id', authenticateToken, deviceCatalogController.getDeviceDetails);
router.post('/devices/purchase', authenticateToken, deviceCatalogController.purchaseDevice);
router.post('/devices/purchase/initiate', authenticateToken, deviceCatalogController.initiatePurchase);
router.get('/purchased-devices', authenticateToken, deviceCatalogController.getUserDevices);

module.exports = router;*/