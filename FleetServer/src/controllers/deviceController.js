const deviceCatalogService = require('../services/deviceCatalog.service');
const { createTraccarDevice } = require('../services/traccarService');
const TraccarDeviceConfig = require('../models/TraccarDeviceConfig');
const { PurchasedDevice } = require('../models/Purchase');
const axios = require('axios');

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

const connectToTraccar = async (req, res) => {
    try {
      const { serialNumber } = req.body;
      // التحقق من وجود الجهاز باستخدام Sequelize
      const device = await PurchasedDevice.findOne({
        where: { serial_number: serialNumber }
      });
  
      if (!device) {
        return res.status(404).json({
          success: false,
          message: 'الجهاز غير موجود'
        });
      }
  
      // إنشاء الجهاز في Traccar
      const traccarDevice = await createTraccarDevice({
          name: String(device.device_id), // تحويل إلى string
          uniqueId: device.serial_number,
        // يمكن إضافة المزيد من الخصائص حسب الحاجة
      });
  
      // تسجيل معلومات Traccار استخدام Sequelize
      await TraccarDeviceConfig.create({
        device_serial_number: serialNumber,
        traccar_id: traccarDevice.id,
        traccar_connection: 'connected',
        traccar_status: traccarDevice.status,
        traccar_disabled: traccarDevice.disabled,
        last_update: traccarDevice.lastUpdate,
        last_position_id: traccarDevice.positionId,
        attributes: traccarDevice.attributes,
        groupId: traccarDevice.groupId,
        calendarId: traccarDevice.calendarId,
        created_at: new Date(),
        updated_at: new Date(),
      });
  
      res.json({
        success: true,
        message: 'تم ربط الجهاز بنجاح'
      });
  
    } catch (error) {
      console.error('Error connecting device to Traccar:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء ربط الجهاز'
      });
    }
};

const updateDeviceTraccarStatus = async (req, res) => {
  try {
    const { serialNumber } = req.params;
    
    // التحقق من وجود الجهاز أولاً في قاعدة بياناتنا
    const existingDevice = await TraccarDeviceConfig.findOne({
      where: { device_serial_number: serialNumber }
    });

    if (!existingDevice) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // جلب البيانات من Traccar API
    const traccarResponse = await axios.get(
      `${process.env.TRACCAR_API_URL}/api/devices/${existingDevice.traccar_id}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.TRACCAR_API_TOKEN}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const traccarDevice = traccarResponse.data;
    
    // تحديث البيانات في قاعدة بياناتنا
    await TraccarDeviceConfig.update({
      traccar_status: traccarDevice.status,
      traccar_disabled: traccarDevice.disabled,
      last_update: traccarDevice.lastUpdate,
      last_position_id: traccarDevice.positionId,
      attributes: traccarDevice.attributes,
      groupId: traccarDevice.groupId,
      calendarId: traccarDevice.calendarId,
      updated_at: new Date(),
    }, {
      where: { device_serial_number: serialNumber }
    });

    res.json({ 
      message: 'Device status updated successfully',
      device: traccarDevice 
    });
  } catch (error) {
    console.error('Error updating device status:', error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
    getDevices,
    getSensors,
    connectToTraccar,
    updateDeviceTraccarStatus
};