const pool = require('../config/database');

class PositionService {
  async savePositions(positions) {
    if (!positions || positions.length === 0) {
      return []; // لا داعي لفتح اتصال مع قاعدة البيانات إذا لم تكن هناك مواقع
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const query = `
        INSERT INTO positions (
          id, device_id, protocol, device_time, fix_time, server_time,
          outdated, valid, latitude, longitude, altitude, speed,
          course, address, accuracy, network, geofence_ids, attributes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `;

      const savedPositions = [];
      for (const position of positions) {
        const result = await client.query(query, [
          position.id,
          position.deviceId,
          position.protocol,
          position.deviceTime,
          position.fixTime,
          position.serverTime,
          position.outdated,
          position.valid,
          position.latitude,
          position.longitude,
          position.altitude,
          position.speed,
          position.course,
          position.address,
          position.accuracy,
          position.network,
          position.geofenceIds,
          position.attributes
        ]);
        
        if (result.rows[0]) {
          savedPositions.push(result.rows[0].id);
        }
      }

      await client.query('COMMIT');
      return savedPositions;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new PositionService(); 