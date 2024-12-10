const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

// إنشاء صيانة جديدة
const createMaintenance = async (req, res) => {
  const {
    vehicle_id,
    recommendation_id,
    type,
    scheduled_date,
    scheduled_end,
    estimated_duration,
    assigned_to,
    cost_estimate,
    notes,
    provider_id,
    custom_provider_name,
    custome_type,
    location
  } = req.body;
  console.log(req.body);
  try {
    const result = await sequelize.query(
      `INSERT INTO maintenance_schedules 
      (vehicle_id, recommendation_id, type, scheduled_date, scheduled_end, 
       estimated_duration, assigned_to, cost_estimate, notes, provider_id, 
       custom_provider_name, custome_type, location, created_at, updated_at) 
      VALUES 
      (:vehicle_id, :recommendation_id, :type, :scheduled_date, :scheduled_end,
       :estimated_duration, :assigned_to, :cost_estimate, :notes, :provider_id,
       :custom_provider_name, :custome_type, 
       ST_SetSRID(ST_GeomFromGeoJSON(:location), 4326),
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id`,
      {
        replacements: {
          vehicle_id,
          recommendation_id,
          type,
          scheduled_date,
          scheduled_end,
          estimated_duration,
          assigned_to,
          cost_estimate,
          notes,
          provider_id,
          custom_provider_name,
          custome_type,
          location: JSON.stringify(location)
        },
        type: QueryTypes.INSERT
      }
    );

    res.status(201).json({
      success: true,
      message: 'Maintenance scheduled successfully',
      data: {
        id: result[0][0].id
      }
    });
  } catch (error) {
    console.error('Error scheduling maintenance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule maintenance',
      error: error.message
    });
  }
};

// الحصول على قائمة الصيانة
const getAllMaintenance = async (req, res) => {
  try {
    const maintenances = await sequelize.query(
      `SELECT 
        ms.*,
        v.name as vehicle_name,
        v.plate_number,
        ST_X(ms.location::geometry) as longitude,
        ST_Y(ms.location::geometry) as latitude
      FROM maintenance_schedules ms
      LEFT JOIN vehicles v ON v.id = ms.vehicle_id
      ORDER BY ms.scheduled_date DESC`,
      {
        type: QueryTypes.SELECT
      }
    );

    // تصنيف الخدمات حسب المواعيد
    const now = new Date();
    const categorizedMaintenance = maintenances.reduce((acc, maintenance) => {
      const startDate = new Date(maintenance.scheduled_date);
      const endDate = new Date(maintenance.scheduled_end);

      if (startDate > now) {
        // لم يحن موعدها بعد
        acc.upcoming.push(maintenance);
      } else if (startDate <= now && endDate > now) {
        // في الوقت الحالي
        acc.active.push(maintenance);
      } else if (endDate <= now) {
        // انتهى موعدها
        acc.history.push(maintenance);
      }
      return acc;
    }, { upcoming: [], active: [], history: [] });

    res.json({
      success: true,
      data: categorizedMaintenance
    });
  } catch (error) {
    console.error('Error fetching maintenance schedules:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch maintenance schedules',
      error: error.message
    });
  }
};

// الحصول على تفاصيل صيانة محددة
const getMaintenanceById = async (req, res) => {
  const { id } = req.params;

  try {
    const maintenance = await sequelize.query(
      `SELECT 
        ms.*,
        v.name as vehicle_name,
        v.plate_number,
        ST_X(ms.location::geometry) as longitude,
        ST_Y(ms.location::geometry) as latitude,
        u.name as assigned_to_name
      FROM maintenance_schedules ms
      LEFT JOIN vehicles v ON v.id = ms.vehicle_id
      LEFT JOIN users u ON u.id = ms.assigned_to
      WHERE ms.id = :id`,
      {
        replacements: { id },
        type: QueryTypes.SELECT
      }
    );

    if (!maintenance[0]) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance schedule not found'
      });
    }

    res.json({
      success: true,
      data: maintenance[0]
    });
  } catch (error) {
    console.error('Error fetching maintenance details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch maintenance details',
      error: error.message
    });
  }
};

// تحديث حالة الصيانة
const updateMaintenanceStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await sequelize.query(
      `UPDATE maintenance_schedules 
      SET status = :status::maintenance_status, updated_at = CURRENT_TIMESTAMP
      WHERE id = :id`,
      {
        replacements: { id, status },
        type: QueryTypes.UPDATE
      }
    );

    res.json({
      success: true,
      message: 'Maintenance status updated successfully'
    });
  } catch (error) {
    console.error('Error updating maintenance status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update maintenance status',
      error: error.message
    });
  }
};

module.exports = {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenanceStatus
};