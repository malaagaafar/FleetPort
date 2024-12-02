// src/routes/driverRoutes.js
const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
//const { createMulter } = require('../utils/uploadManager');

// استخدام multer بشكل غير متزامن
/*router.post('/upload', async (req, res, next) => {
    try {
        const upload = await createMulter();
        upload.single('profile_image')(req, res, next);
    } catch (error) {
        next(error);
    }
});*/

// راوتر خاص بسائقي الشركات (يتطلب مصادقة)
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