const pool = require('../config/database');

class PositionService {
  async savePositions(positions) {
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
      `;

      for (const position of positions) {
        await client.query(query, [
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
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new PositionService(); 