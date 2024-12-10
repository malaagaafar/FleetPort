const { sequelize } = require('../config/database');
const systemDb = require('../config/systemDb');

exports.getVehicleDevice = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const userId = req.query.userId;

    // أولاً نجلب الـ device_serial_number من جدول التعيينات
    const assignmentQuery = `
      SELECT 
        dva.device_serial_number,
        v.id as vehicle_id,
        v.name as vehicle_name
      FROM device_vehicle_assignments dva
      JOIN vehicles v ON v.id = dva.vehicle_id
      WHERE v.id = :vehicleId
        AND v.user_id = :userId
      ORDER BY dva.created_at DESC
      LIMIT 1
    `;

    const assignment = await sequelize.query(assignmentQuery, {
      replacements: { vehicleId, userId },
      type: sequelize.QueryTypes.SELECT
    });

    if (assignment.length === 0) {
      return res.status(404).json({ message: 'Device assignment not found' });
    }

    // ثم نجلب معلومات الجهاز من قاعدة البيانات الأخرى
    const deviceQuery = `
      SELECT 
        id as device_id,
        name as device_name,
        unique_id,
        status as device_status
      FROM devices
      WHERE unique_id = :deviceSerialNumber
      LIMIT 1
    `;

    const device = await systemDb.query(deviceQuery, {
      replacements: { deviceSerialNumber: assignment[0].device_serial_number },
      type: systemDb.QueryTypes.SELECT
    });

    if (device.length === 0) {
      return res.status(404).json({ message: 'Device not found in system database' });
    }

    // دمج النتائج
    res.json({
      ...assignment[0],
      ...device[0]
    });

  } catch (error) {
    console.error('Error fetching device assignment:', error);
    res.status(500).json({ message: 'Error fetching device assignment' });
  }
}; 