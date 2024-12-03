const Vehicle = require('../models/Vehicle');
const { sequelize } = require('../config/database');

// دالة لإنشاء مركبة جديدة
const createVehicle = async (req, res) => {
  try {
    const vehicleData = req.body; // استلام البيانات من الطلب
    const newVehicle = await Vehicle.create(vehicleData); // إنشاء مركبة جديدة
    res.status(201).json(newVehicle); // إرجاع المركبة الجديدة مع حالة 201
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'حدث خطأ أثناء إنشاء المركبة' }); // إرجاع رسالة خطأ
  }
};
// ... existing code ...
const getAllVehicles = async (req, res) => {
  const userId = req.query.userId; // الحصول على userId من استعلام الطلب

  try {
    const vehicles = await Vehicle.findAll({
      where: {
        userId: userId // تصفية المركبات بناءً على userId
      }
    });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailableVehiclesForDevice = async (req, res) => {
  try {
    const { userId, deviceType } = req.query;
    
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'User ID must be provided.'
        });
    }

    // Check if the user has any vehicles
    const hasVehicles = await Vehicle.count({
        where: {
            user_id: userId
        }
    });

    if (hasVehicles === 0) {
        return res.json({
            success: true,
            vehicles: [],
            message: 'No vehicles added for this user.'
        });
    }

    // Query to fetch available vehicles, including the 'name' field
    const query = `
        SELECT 
            v.id,
            v.name,         
            v.make,
            v.model,
            v.year,
            v.plate_number,
            v.type,
            v.status
        FROM vehicles v
        WHERE v.user_id = :userId 
          AND v.type = :deviceType
          AND v.status = 'active'
          AND NOT EXISTS (
              SELECT 1 
              FROM device_vehicle_assignments dva
              WHERE dva.vehicle_id = v.id
          )
        ORDER BY v.created_at DESC
    `;

    const availableVehicles = await sequelize.query(query, {
        replacements: { userId, deviceType },
        type: sequelize.QueryTypes.SELECT
    });

    return res.json({
        success: true,
        vehicles: availableVehicles,
        message: availableVehicles.length === 0 ? 
            'No vehicles available for assignment.' : 
            `${availableVehicles.length} available vehicle(s) found.`
    });

  } catch (error) {
      console.error('Error fetching available vehicles:', error);
      return res.status(500).json({
          success: false,
          message: 'An error occurred while fetching available vehicles.',
          error: error.message
      });
  }
};

const getAvailableVehiclesForAllDevices = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'User ID must be provided.'
        });
    }

    // Check if the user has any vehicles
    const hasVehicles = await Vehicle.count({
        where: {
            user_id: userId
        }
    });

    if (hasVehicles === 0) {
        return res.json({
            success: true,
            vehicles: [],
            message: 'No vehicles added for this user.'
        });
    }

    // Query to fetch available vehicles, including the 'name' field
    const query = `
        SELECT 
            v.*
        FROM vehicles v
        WHERE v.user_id = :userId 
          AND v.status = 'active'
          AND NOT EXISTS (
              SELECT 1 
              FROM device_vehicle_assignments dva
              WHERE dva.vehicle_id = v.id
          )
        ORDER BY v.created_at DESC
    `;

    const availableVehicles = await sequelize.query(query, {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT
    });

    return res.json({
        success: true,
        vehicles: availableVehicles,
        message: availableVehicles.length === 0 ? 
            'No vehicles available for assignment.' : 
            `${availableVehicles.length} available vehicle(s) found.`
    });

  } catch (error) {
      console.error('Error fetching available vehicles:', error);
      return res.status(500).json({
          success: false,
          message: 'An error occurred while fetching available vehicles.',
          error: error.message
      });
  }
};

const getVehiclesForAssignment = async (req, res) => {
    try {
        const { userId } = req.query;
        
        const query = `
            SELECT 
                v.id,
                v.name,
                v.make,
                v.model,
                v.year,
                v.plate_number,
                v.type,
                v.status,
                v.vehicle_image,
                (
                    SELECT COUNT(dva.id) 
                    FROM drivers_vehicle_assignments dva 
                    WHERE dva.vehicle_id = v.id 
                    AND dva.status = 'active'
                    AND (dva.end_date IS NULL OR dva.end_date > CURRENT_TIMESTAMP)
                ) as active_drivers_count
            FROM vehicles v
            WHERE v.user_id = :userId 
            AND v.status = 'active'
            ORDER BY v.created_at DESC
        `;

        const vehicles = await sequelize.query(query, {
            replacements: { userId },
            type: sequelize.QueryTypes.SELECT
        });

        return res.json({
            success: true,
            vehicles: vehicles.map(v => ({
                ...v,
                canAssignDriver: v.active_drivers_count < 4
            }))
        });

    } catch (error) {
        console.error('Error fetching vehicles for assignment:', error);
        return res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب المركبات',
            error: error.message
        });
    }
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getAvailableVehiclesForDevice,
  getAvailableVehiclesForAllDevices,
  getVehiclesForAssignment
};