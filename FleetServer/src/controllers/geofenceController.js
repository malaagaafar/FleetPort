const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

const createGeofence = async (req, res) => {
  try {
    console.log(req.body);
    const { name, description, radius, center, icon, user_id } = req.body;

    if (!name || !radius || !center || !center.coordinates) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, radius, or center coordinates'
      });
    }

    const longitude = center.coordinates[0];
    const latitude = center.coordinates[1];

    if (typeof longitude !== 'number' || typeof latitude !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates format'
      });
    }

    const radiusNum = parseFloat(radius);
    if (isNaN(radiusNum) || radiusNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid radius value'
      });
    }

    const query = `
      INSERT INTO geofences (
        name, 
        description, 
        radius, 
        center, 
        icon,
        user_id,
        created_at,
        updated_at
      )
      VALUES (
        $1, 
        $2, 
        $3, 
        ST_SetSRID(ST_MakePoint($4, $5), 4326),
        $6,
        $7,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING id, name, description, radius, 
        ST_X(center::geometry) as longitude,
        ST_Y(center::geometry) as latitude,
        icon,
        user_id,
        created_at;
    `;

    const result = await sequelize.query(query, {
      bind: [
        name,
        description || null,
        radiusNum,
        longitude,
        latitude,
        icon || 'parking',
        user_id
      ],
      type: QueryTypes.INSERT
    });

    res.status(201).json({
      success: true,
      data: result[0][0]
    });
  } catch (error) {
    console.error('Error creating geofence:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create geofence',
      error: error.message
    });
  }
};

const getAllGeofences = async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        name,
        description,
        radius,
        ST_X(center::geometry) as longitude,
        ST_Y(center::geometry) as latitude,
        icon,
        user_id,
        created_at
      FROM geofences
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;

    const geofences = await sequelize.query(query, {
      bind: [req.user.id],
      type: QueryTypes.SELECT
    });

    res.json({
      success: true,
      data: geofences
    });
  } catch (error) {
    console.error('Error fetching geofences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch geofences',
      error: error.message
    });
  }
};

const getGeofenceById = async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        name,
        description,
        radius,
        ST_X(center::geometry) as longitude,
        ST_Y(center::geometry) as latitude,
        icon,
        user_id,
        created_at
      FROM geofences
      WHERE id = $1 AND user_id = $2;
    `;

    const geofence = await sequelize.query(query, {
      bind: [req.params.id, req.user.id],
      type: QueryTypes.SELECT
    });

    if (geofence.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Geofence not found'
      });
    }

    res.json({
      success: true,
      data: geofence[0]
    });
  } catch (error) {
    console.error('Error fetching geofence:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch geofence',
      error: error.message
    });
  }
};

const updateGeofence = async (req, res) => {
  const { name, description, radius, center, icon } = req.body;

  try {
    const query = `
      UPDATE geofences
      SET 
        name = $1,
        description = $2,
        radius = $3,
        center = CASE 
          WHEN $4 IS NOT NULL AND $5 IS NOT NULL 
          THEN ST_SetSRID(ST_MakePoint($4, $5), 4326)
          ELSE center
        END,
        icon = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 AND user_id = $8
      RETURNING id, name, description, radius,
        ST_X(center::geometry) as longitude,
        ST_Y(center::geometry) as latitude,
        icon,
        user_id,
        updated_at;
    `;

    const result = await sequelize.query(query, {
      bind: [
        name,
        description,
        radius,
        center?.coordinates[0], // longitude
        center?.coordinates[1], // latitude
        icon,
        req.params.id,
        req.user.id
      ],
      type: QueryTypes.UPDATE
    });

    if (result[0].length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Geofence not found or unauthorized'
      });
    }

    res.json({
      success: true,
      data: result[0][0]
    });
  } catch (error) {
    console.error('Error updating geofence:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update geofence',
      error: error.message
    });
  }
};

const deleteGeofence = async (req, res) => {
  try {
    const query = `
      DELETE FROM geofences
      WHERE id = $1 AND user_id = $2
      RETURNING id;
    `;

    const result = await sequelize.query(query, {
      bind: [req.params.id, req.user.id],
      type: QueryTypes.DELETE
    });

    if (result[0].length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Geofence not found or unauthorized'
      });
    }

    res.json({
      success: true,
      message: 'Geofence deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting geofence:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete geofence',
      error: error.message
    });
  }
};

module.exports = {
  createGeofence,
  getAllGeofences,
  getGeofenceById,
  updateGeofence,
  deleteGeofence
}; 