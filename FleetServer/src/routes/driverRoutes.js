// src/routes/driverRoutes.js
const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');

// مسارات تسجيل الدخول والمركبات
router.post('/login', driverController.loginDriver);
router.post('/vehicle/login', driverController.vehicleLogin);
router.post('/vehicle/logout', driverController.vehicleLogout);
router.get('/home', driverController.getHomeData);

// المسارات الموجودة مسبقاً
router.post('/company', driverController.createCompanyDriver);
router.get('/company', driverController.getCompanyDrivers);
router.get('/company/:id', driverController.getCompanyDriver);
router.put('/company/:id', driverController.updateCompanyDriver);
router.delete('/company/:id', driverController.deleteCompanyDriver);
router.put('/company/:id/status', driverController.updateCompanyDriverStatus);
router.get('/for-assignment', driverController.getDriversForAssignment);
// راوتر خاص بالسائقين المستقلين (سيتم تنفيذه لاحقاً)
//router.post('/independent/register', driverController.registerIndependentDriver);

module.exports = router;