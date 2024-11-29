const purchaseService = require('../services/purchaseService');
// دالة لمعالجة عملية الشراء
const handlePurchase = async (req, res) => {
    const { id, items, total, date, userId } = req.body; // استلام البيانات الجديدة

    try {
        await purchaseService.recordPurchase({ id, items, total, date, userId }); // تمرير البيانات إلى الخدمة
        await purchaseService.processPurchasesByUser(userId); // استدعاء الدالة لمعالجة العمليات

        res.status(201).json({ message: 'تم تسجيل عملية الشراء بنجاح.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const { sequelize } = require('../config/database');

const getPurchasedDevices = async (req, res) => {
    try {
        const { userId } = req.query;
        console.log('Fetching devices for user:', userId);

        const query = `
            SELECT 
                pd.id,
                pd.device_id,
                pd.serial_number,
                pd.created_at as purchase_date,
                d.name,
                d.type,
                d.model,
                d.manufacturer,
                d.image_url,
                dva.vehicle_id,
                v.plate_number as vehicle_plate_number,
                CASE WHEN dva.id IS NOT NULL THEN true ELSE false END as assigned_to_vehicle
            FROM purchased_devices pd
            JOIN primary_devices d ON pd.device_id = d.id
            LEFT JOIN device_vehicle_assignments dva ON pd.serial_number = dva.device_serial_number
            LEFT JOIN vehicles v ON dva.vehicle_id = v.id
            WHERE pd.user_id = :userId
            ORDER BY pd.created_at DESC
        `;

        const purchasedDevices = await sequelize.query(query, {
            replacements: { userId },
            type: sequelize.QueryTypes.SELECT
        });

        console.log('Found purchased devices:', JSON.stringify(purchasedDevices, null, 2));

        res.json({
            success: true,
            data: purchasedDevices || []
        });
    } catch (error) {
        console.error('خطأ في جلب الأجهزة المشتراة:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب الأجهزة المشتراة',
            error: error.message
        });
    }
};

const getPurchasedSensors = async (req, res) => {
    try {
      const { userId } = req.query;
      
      const query = `
        SELECT DISTINCT ON (ps.serial_number) 
          ps.*,
          s.name,
          s.type,
          s.manufacturer,
          s.model,
          s.image_url,
          sda.device_serial_number,
          CASE WHEN sda.sensor_serial_number IS NOT NULL THEN true ELSE false END as assigned
        FROM purchased_sensors ps
        JOIN sensors s ON ps.sensor_id = s.id
        LEFT JOIN sensor_device_assignments sda ON ps.serial_number = sda.sensor_serial_number
        WHERE ps.user_id = :userId
        ORDER BY ps.serial_number, ps.created_at DESC
      `;
  
      const sensors = await sequelize.query(query, {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT
      });
  
      res.json({
        success: true,
        data: sensors
      });
    } catch (error) {
      console.error('Error fetching purchased sensors:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ في جلب المستشعرات المشتراة'
      });
    }
  };

const getAvailableDevicesForSensor = async (req, res) => {
    try {
        const { userId, sensorType } = req.query;
        
        if (!userId || !sensorType) {
            return res.status(400).json({
                success: false,
                message: 'يجب توفير معرف المستخدم ونوع المستشعر'
            });
        }

        const query = `
            SELECT 
                pd.serial_number,
                d.name,
                d.manufacturer,
                d.model,
                d.type,
                d.image_url
            FROM purchased_devices pd
            JOIN primary_devices d ON pd.device_id = d.id
            WHERE pd.user_id = :userId
            AND NOT EXISTS (
                SELECT 1 
                FROM sensor_device_assignments sda
                JOIN purchased_sensors ps ON sda.sensor_serial_number = ps.serial_number
                JOIN sensors s ON ps.sensor_id = s.id
                WHERE sda.device_serial_number = pd.serial_number
                AND s.type = :sensorType
            )
            AND :sensorType = ANY(d.supported_sensors) -- تم تغيير طريقة التحقق من المصفوفة
            ORDER BY pd.created_at DESC
        `;

        const availableDevices = await sequelize.query(query, {
            replacements: { 
                userId,
                sensorType
            },
            type: sequelize.QueryTypes.SELECT
        });

        res.json({
            success: true,
            devices: availableDevices
        });

    } catch (error) {
        console.error('Error fetching available devices:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب الأجهزة المتاحة',
            error: error.message
        });
    }
};

const assignSensorToDevice = async (req, res) => {
    try {
        const { sensorSerial, deviceSerial, userId } = req.body;
        
        if (!sensorSerial || !deviceSerial || !userId) {
            return res.status(400).json({
                success: false,
                message: 'جميع الحقول مطلوبة: الرقم التسلسلي للمستشعر والجهاز ومعرف المستخدم'
            });
        }

        // التحقق من وجود ربط مسبق
        const existingAssignment = await sequelize.query(
            `SELECT * FROM sensor_device_assignments 
            WHERE sensor_serial_number = :sensorSerial`,
            {
                replacements: { sensorSerial },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (existingAssignment.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'هذا المستشعر مرتبط بالفعل بجهاز آخر'
            });
        }

        // التحقق من أن المستشعر والجهاز ينتميان للمستخدم
        const [sensor, device] = await Promise.all([
            sequelize.query(
                'SELECT * FROM purchased_sensors WHERE serial_number = :sensorSerial AND user_id = :userId',
                {
                    replacements: { sensorSerial, userId },
                    type: sequelize.QueryTypes.SELECT
                }
            ),
            sequelize.query(
                'SELECT * FROM purchased_devices WHERE serial_number = :deviceSerial AND user_id = :userId',
                {
                    replacements: { deviceSerial, userId },
                    type: sequelize.QueryTypes.SELECT
                }
            )
        ]);

        if (!sensor[0] || !device[0]) {
            return res.status(404).json({
                success: false,
                message: 'المستشعر أو الجهاز غير موجود أو لا ينتمي للمستخدم'
            });
        }

        // إنشاء الربط في جدول sensor_device_assignments
        await sequelize.query(
            `INSERT INTO sensor_device_assignments 
            (sensor_serial_number, device_serial_number) 
            VALUES (:sensorSerial, :deviceSerial)`,
            {
                replacements: { sensorSerial, deviceSerial }
            }
        );

        // تحديث حالة المستشعر
        await sequelize.query(
            `UPDATE purchased_sensors 
            SET assigned = true 
            WHERE serial_number = :sensorSerial`,
            {
                replacements: { sensorSerial }
            }
        );

        res.json({
            success: true,
            message: 'تم ربط المستشعر بالجهاز بنجاح'
        });

    } catch (error) {
        console.error('Error assigning sensor:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء ربط المستشعر بالجهاز',
            error: error.message
        });
    }
};

const assignDeviceToVehicle = async (req, res) => {
    try {
        const { deviceSerial, vehicleId, userId } = req.body;
        
        if (!deviceSerial || !vehicleId || !userId) {
            return res.status(400).json({
                success: false,
                message: 'جميع الحقول مطلوبة'
            });
        }

        // التحقق من عدم وجود ربط مسبق
        const existingAssignment = await sequelize.query(
            `SELECT * FROM device_vehicle_assignments 
            WHERE device_serial_number = :deviceSerial 
            OR vehicle_id = :vehicleId`,
            {
                replacements: { deviceSerial, vehicleId },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (existingAssignment.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'الجهاز أو المركبة مرتبطة بالفعل'
            });
        }

        // إنشاء الربط
        await sequelize.query(
            `INSERT INTO device_vehicle_assignments 
            (device_serial_number, vehicle_id) 
            VALUES (:deviceSerial, :vehicleId)`,
            {
                replacements: { deviceSerial, vehicleId }
            }
        );

        res.json({
            success: true,
            message: 'تم ربط الجهاز بالمركبة بنجاح'
        });

    } catch (error) {
        console.error('Error assigning device:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء ربط الجهاز بالمركبة',
            error: error.message
        });
    }
};

module.exports = { handlePurchase, getPurchasedDevices, getPurchasedSensors, getAvailableDevicesForSensor, assignSensorToDevice, assignDeviceToVehicle }; // تأكد من تصدير كائن يحتوي على الدالة