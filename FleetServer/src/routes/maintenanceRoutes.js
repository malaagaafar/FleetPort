const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

// طرق الوصول للخدمات
router.post('/schedule', maintenanceController.createMaintenance);
router.get('/maintenances', maintenanceController.getAllMaintenance);
router.get('/maintenance/:id', maintenanceController.getMaintenanceById);
router.patch('/maintenance/:id/status', maintenanceController.updateMaintenanceStatus);

module.exports = router;