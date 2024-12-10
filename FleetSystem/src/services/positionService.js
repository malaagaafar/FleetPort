const db = require('../config/database');

class PositionService {
    async savePositions(positions) {
        const client = await db.connect();
        try {
            await client.query('BEGIN');
            
            const savedPositions = [];
            for (const position of positions) {
                // استخراج مستوى الوقود من attributes
                let fuelLevel = null;
                if (position.attributes) {
                    // يمكن أن يكون اسم الخاصية مختلفاً حسب نوع الجهاز
                    fuelLevel = position.attributes.fuel || 
                              position.attributes.fuelLevel || 
                              position.attributes.fuel1 ||
                              null;
                }

                const result = await client.query(
                    `INSERT INTO positions (
                        device_id, protocol, device_time, fix_time, 
                        server_time, latitude, longitude, altitude, 
                        speed, course, address, attributes, fuel_level
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                    RETURNING *`,
                    [
                        position.deviceId,
                        position.protocol,
                        position.deviceTime,
                        position.fixTime,
                        position.serverTime,
                        position.latitude,
                        position.longitude,
                        position.altitude,
                        position.speed,
                        position.course,
                        position.address,
                        position.attributes,
                        fuelLevel // إضافة مستوى الوقود كعمود منفصل
                    ]
                );
                savedPositions.push(result.rows[0]);
            }

            await client.query('COMMIT');
            return savedPositions;
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Service error:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    // إضافة دالة للحصول على سجل الوقود
    async getFuelHistory(deviceId, startTime, endTime) {
        const query = `
            SELECT 
                p.device_time,
                p.fuel_level,
                p.attributes,
                fl.id as fuel_log_id,
                fl.price_per_liter,
                fl.total_cost,
                fl.status
            FROM positions p
            LEFT JOIN fuel_logs fl ON 
                p.device_id = fl.device_id AND 
                p.device_time = fl.filling_time
            WHERE p.device_id = $1 
            AND p.device_time BETWEEN $2 AND $3
            AND p.fuel_level IS NOT NULL
            ORDER BY p.device_time DESC
        `;
        
        const result = await db.query(query, [deviceId, startTime, endTime]);
        return result.rows;
    }
}

module.exports = new PositionService();