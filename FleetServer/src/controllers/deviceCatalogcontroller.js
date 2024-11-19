const deviceCatalogService = require('../services/deviceCatalogservice');

class DeviceCatalogController {
    // ... الدالة الحالية ...

    async getDeviceDetails(req, res) {
        try {
            const { id } = req.params;
            const device = await deviceCatalogService.getDeviceById(id);
            
            res.json({
                status: 'success',
                data: device
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async purchaseDevice(req, res) {
        try {
            const userId = req.user.id; // من middleware المصادقة
            const { 
                deviceId, 
                quantity = 1,
                serialNumbers,
                imeiNumbers,
                phoneNumbers
            } = req.body;

            const result = await deviceCatalogService.purchaseDevice({
                userId,
                deviceId,
                quantity,
                serialNumbers,
                imeiNumbers,
                phoneNumbers
            });

            res.json({
                status: 'success',
                message: 'تم شراء الجهاز بنجاح',
                data: result
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getUserDevices(req, res) {
        try {
            const userId = req.user.id;
            const devices = await deviceCatalogService.getUserPurchasedDevices(userId);
            
            res.json({
                status: 'success',
                data: devices
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async initiatePurchase(req, res) {
        try {
            const userId = req.user.id;
            const { deviceId, quantity, serialNumbers, imeiNumbers, phoneNumbers } = req.body;
    
            const result = await deviceCatalogService.initiateDevicePurchase({
                userId,
                deviceId,
                quantity,
                serialNumbers,
                imeiNumbers,
                phoneNumbers
            });
    
            res.json({
                status: 'success',
                data: result
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

module.exports = new DeviceCatalogController();