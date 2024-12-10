const sysDB = require('../config/systemDb');
const {sequelize} = require('../config/database');

const getFuelLogsSummary = async (req, res) => {
    try {
        const { userId } = req.query;
        
        // أولاً: نجلب الأجهزة من cport
        const devicesQuery = `
            SELECT d.serial_number 
            FROM purchased_devices d
            JOIN device_vehicle_assignments dva ON d.serial_number = dva.device_serial_number
            JOIN vehicles v ON dva.vehicle_id = v.id
            WHERE v.user_id = :userId
        `;
        const devices = await sequelize.query(devicesQuery, {
            replacements: { userId },
            type: sequelize.QueryTypes.SELECT
        });
        const deviceSerials = devices.map(d => d.serial_number);

        if (deviceSerials.length === 0) {
            return res.json({ total: 0, confirmed: 0, pending: 0 });
        }

        // ثانياً: نستخدم الأجهزة للبحث في systemDb
        const logsQuery = `
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN fl.status = 'confirmed' THEN 1 END) as confirmed,
                COUNT(CASE WHEN fl.status = 'pending' THEN 1 END) as pending
            FROM fuel_logs fl
            JOIN devices d ON fl.device_id = d.id
            WHERE d.unique_id = ANY(ARRAY[:deviceSerials])
        `;
        
        const result = await sysDB.query(logsQuery, {
            replacements: { deviceSerials },
            type: sequelize.QueryTypes.SELECT
        });
        console.log(result);
        // إذا لم تكن هناك نتائج، نرجع أصفار
        if (!result || result.length === 0) {
            return res.json({ total: 0, confirmed: 0, pending: 0 });
        }
        res.json(result[0]);
    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ error: 'Error fetching fuel logs summary' });
    }
};

const getRecentFuelLogs = async (req, res) => {
    try {
        const { userId, limit = 5 } = req.query;
        
        // أولاً: نجلب الأجهزة والمركبات من cport
        const vehiclesQuery = `
            SELECT d.serial_number, v.name as vehicle_name
            FROM purchased_devices d
            JOIN device_vehicle_assignments dva ON d.serial_number = dva.device_serial_number
            JOIN vehicles v ON dva.vehicle_id = v.id
            WHERE v.user_id = :userId
        `;
        const vehiclesResult = await sequelize.query(vehiclesQuery, {
            replacements: { userId },
            type: sequelize.QueryTypes.SELECT
        });


        if (!vehiclesResult || vehiclesResult.length === 0) {
            return res.json([]);
        }

        const deviceSerials = vehiclesResult.map(d => d.serial_number);
        const vehicleNames = {};
        vehiclesResult.forEach(v => {
            vehicleNames[v.serial_number] = v.vehicle_name;
        });

        if (deviceSerials.length === 0) {
            return res.json([]);
        }

        // ثانياً: نجلب سجلات الوقود من systemDb
        const logsQuery = `
            SELECT fl.*, d.unique_id
            FROM fuel_logs fl
            JOIN devices d ON fl.device_id = d.id
            WHERE d.unique_id = ANY(ARRAY[:deviceSerials])
            ORDER BY fl.filling_time DESC
            LIMIT :limit
        `;
        
        const result = await sysDB.query(logsQuery, {
            replacements: { deviceSerials, limit },
            type: sequelize.QueryTypes.SELECT
        });
        
        // إضافة اسم المركبة لكل سجل
        const logsWithVehicleNames = result.map(log => ({
            ...log,
            vehicle_name: vehicleNames[log.unique_id]
        }));
        console.log(logsWithVehicleNames);
        res.json(logsWithVehicleNames);
    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ error: 'Error fetching recent fuel logs' });
    }
};

const getFuelLog = async (req, res) => {
    try {
        const { id } = req.params;
        
        // نجلب سجل الوقود من systemDb
        const logQuery = `
            SELECT fl.*, d.unique_id
            FROM fuel_logs fl
            JOIN devices d ON fl.device_id = d.id
            WHERE fl.id = :id
        `;
        const logResult = await sysDB.query(logQuery, {
            replacements: { id },
            type: sequelize.QueryTypes.SELECT
        });
        
        if (!logResult[0]) {
            return res.status(404).json({ error: 'Fuel log not found' });
        }

        // نجلب معلومات المركبة من cport
        const vehicleQuery = `
            SELECT v.name as vehicle_name
            FROM purchased_devices d
            JOIN device_vehicle_assignments dva ON d.serial_number = dva.device_serial_number
            JOIN vehicles v ON dva.vehicle_id = v.id
            WHERE d.serial_number = :serialNumber
        `;
        const vehicleResult = await sequelize.query(vehicleQuery, {
            replacements: { serialNumber: logResult[0].serial_number },
            type: sequelize.QueryTypes.SELECT
        });
        
        const fuelLog = {
            ...logResult[0],
            vehicle_name: vehicleResult[0]?.vehicle_name
        };
        
        res.json(fuelLog);
    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ error: 'Error fetching fuel log' });
    }
};

const createFuelLog = async (req, res) => {
    try {
        const logData = req.body;
        const query = `
            INSERT INTO fuel_logs (
                device_id, previous_level, new_level,
                liters_added, price_per_liter, total_cost,
                filling_time, status
            ) VALUES (:deviceId, :previousLevel, :newLevel, :litersAdded, :pricePerLiter, :totalCost, :fillingTime, 'pending')
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
        res.status(201).json(result[0]);
    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ error: 'Error creating fuel log' });
    }
};

const updateFuelLog = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const query = `
            UPDATE fuel_logs
            SET 
                price_per_liter = COALESCE(:pricePerLiter, price_per_liter),
                total_cost = COALESCE(:totalCost, total_cost),
                receipt_image_url = COALESCE(:receiptImageUrl, receipt_image_url),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
            RETURNING *
        `;
        
        const values = [
            updates.pricePerLiter,
            updates.totalCost,
            updates.receiptImageUrl,
            id
        ];
        
        const result = await sysDB.query(query, values);
        if (!result[0]) {
            return res.status(404).json({ error: 'Fuel log not found' });
        }
        res.json(result[0]);
    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ error: 'Error updating fuel log' });
    }
};

const confirmFuelLog = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const query = `
            UPDATE fuel_logs
            SET 
                status = 'confirmed',
                confirmed_by = :userId,
                confirmation_time = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
            RETURNING *
        `;
        
        const result = await sysDB.query(query, {
            replacements: { userId, id },
            type: sequelize.QueryTypes.SELECT
        });
        if (!result[0]) {
            return res.status(404).json({ error: 'Fuel log not found' });
        }
        res.json(result[0]);
    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ error: 'Error confirming fuel log' });
    }
};

module.exports = {
    getFuelLogsSummary,
    getRecentFuelLogs,
    getFuelLog,
    createFuelLog,
    updateFuelLog,
    confirmFuelLog
};