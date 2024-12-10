const sysDB = require('../config/systemDb');

class FuelLogsService {
    async getFuelLogsSummary(userId) {
        const query = `
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending
            FROM fuel_logs fl
            JOIN devices d ON fl.device_id = d.id
            WHERE d.user_id = $1
        `;
        
        const result = await sysDB.query(query, [userId]);
        return result.rows[0];
    }

    async getRecentFuelLogs(userId, limit = 5) {
        const query = `
            SELECT 
                fl.*,
                d.name as vehicle_name
            FROM fuel_logs fl
            JOIN devices d ON fl.device_id = d.id
            WHERE d.user_id = $1
            ORDER BY fl.filling_time DESC
            LIMIT $2
        `;
        
        const result = await sysDB.query(query, [userId, limit]);
        return result.rows;
    }

    async getFuelLog(id) {
        const query = `
            SELECT 
                fl.*,
                d.name as vehicle_name
            FROM fuel_logs fl
            JOIN devices d ON fl.device_id = d.id
            WHERE fl.id = $1
        `;
        
        const result = await sysDB.query(query, [id]);
        return result.rows[0];
    }

    async createFuelLog(logData) {
        const query = `
            INSERT INTO fuel_logs (
                device_id, previous_level, new_level,
                liters_added, price_per_liter, total_cost,
                filling_time, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        
        const values = [
            logData.deviceId,
            logData.previousLevel,
            logData.newLevel,
            logData.litersAdded,
            logData.pricePerLiter,
            logData.totalCost,
            logData.fillingTime,
            'pending'
        ];
        
        const result = await sysDB.query(query, values);
        return result.rows[0];
    }

    async updateFuelLog(id, updates) {
        const query = `
            UPDATE fuel_logs
            SET 
                price_per_liter = COALESCE($1, price_per_liter),
                total_cost = COALESCE($2, total_cost),
                receipt_image_url = COALESCE($3, receipt_image_url),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING *
        `;
        
        const values = [
            updates.pricePerLiter,
            updates.totalCost,
            updates.receiptImageUrl,
            id
        ];
        
        const result = await sysDB.query(query, values);
        return result.rows[0];
    }

    async confirmFuelLog(id, userId) {
        const query = `
            UPDATE fuel_logs
            SET 
                status = 'confirmed',
                confirmed_by = $1,
                confirmation_time = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `;
        
        const result = await sysDB.query(query, [userId, id]);
        return result.rows[0];
    }
}

module.exports = new FuelLogsService();