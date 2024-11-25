const deviceCatalogService = require('../services/deviceCatalog.service');

const getDevices = async (req, res) => {
    try {
        console.log('=== Controller Start ===');
        console.log('Request query:', req.query);
        console.log('Request path:', req.path);
        console.log('Request method:', req.method);

        const { 
            category = req.query.category, 
            type = req.query.vehicleType || null,
            trailerType = req.query.trailerType || null, // تأكد من استخدام trailerType
            page = 1, 
            limit = 10 
        } = req.query; // إضافة = req.query في النهاية

        console.log('Parsed params:', { category, type, trailerType, page, limit });

        const result = await deviceCatalogService.getAvailableDevices({
            category,
            type,
            trailerType,
            page: Number(page),
            limit: Number(limit)
        });

        console.log('Service result:', JSON.stringify(result, null, 2));

        // تحقق من البيانات قبل إرسالها
        if (!result || !result.devices) {
            throw new Error('لم يتم العثور على بيانات');
        }

        res.status(200).json({
            success: true,
            devices: result.devices,
            pagination: result.pagination
        });

        console.log('=== Controller End ===');

    } catch (error) {
        console.error('=== Controller Error ===');
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        res.status(500).json({
            success: false,
            error: error.message || 'خطأ في جلب بيانات الأجهزة',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

const getSensors = async (req, res) => {
    try {
        console.log('=== Controller Start ===');
        console.log('Request query:', req.query);
        console.log('Request path:', req.path);
        console.log('Request method:', req.method);

        const { 
            category = 'sensors', 
            type,
            page = 1, 
            limit = 10 
        } = req.query;

        console.log('Parsed params:', { category, type, page, limit });

        const result = await deviceCatalogService.getAvailableDevices({
            category,
            type,
            page: Number(page),
            limit: Number(limit)
        });

        console.log('Service result:', JSON.stringify(result, null, 2));

        // تحقق من البيانات قبل إرسالها
        if (!result || !result.devices) {
            throw new Error('لم يتم العثور على بيانات');
        }

        res.status(200).json({
            success: true,
            devices: result.devices,
            pagination: result.pagination
        });

        console.log('=== Controller End ===');

    } catch (error) {
        console.error('=== Controller Error ===');
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        res.status(500).json({
            success: false,
            error: error.message || 'خطأ في جلب بيانات الأجهزة',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

module.exports = {
    getDevices,
    getSensors
};