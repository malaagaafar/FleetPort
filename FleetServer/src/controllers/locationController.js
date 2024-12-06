const { sequelize } = require('../config/database');
const systemDb = require('../config/systemDb');
const locationService = require('../services/locationService');


class LocationController {
    constructor() {
        this.isDeviceOnline = this.isDeviceOnline.bind(this);
        this.getVehicleLocations = this.getVehicleLocations.bind(this);
    }

    isDeviceOnline(lastUpdateTime) {
        if (!lastUpdateTime) return false;
        
        const lastUpdate = new Date(lastUpdateTime);
        const now = new Date();
        const diffMinutes = (now.getTime() - lastUpdate.getTime()) / 1000 / 60;
        
        return diffMinutes <= 2;
    }

    async getVehicleLocations(req, res) {
        try {
            const vehiclesResult = await sequelize.query(`
                SELECT 
                    v.*,
                    tdc.traccar_id
                FROM 
                    vehicles v
                    INNER JOIN device_vehicle_assignments dva ON v.id = dva.vehicle_id
                    INNER JOIN traccar_device_configs tdc ON dva.device_serial_number = tdc.device_serial_number
                WHERE 
                    v.user_id = :userId
            `, {
                replacements: { userId: req.query.userId },
                type: sequelize.QueryTypes.SELECT
            });

        const vehicles = Array.isArray(vehiclesResult) ? vehiclesResult : [vehiclesResult];

            if (vehicles.length === 0) {
                return res.status(404).json({ message: 'No vehicles found' });
            }

        const positionsResult = await systemDb.query(`
            SELECT DISTINCT ON (device_id)
                p.*,
                d.status as device_status
            FROM 
                positions p
                INNER JOIN devices d ON p.device_id = d.id
            WHERE 
                p.device_id IN (:traccarIds)
            ORDER BY 
                device_id, p.device_time DESC
        `, {
            replacements: { 
                traccarIds: vehicles.map(v => v.traccar_id)
            }
        });

        const positions = Array.isArray(positionsResult[0]) ? positionsResult[0] : [];

        const formattedLocations = vehicles.map(vehicle => {
            const position = positions.find(p => p.device_id === parseInt(vehicle.traccar_id));
            const isOnline = this.isDeviceOnline(position?.device_time);

            return {
                id: vehicle.id,
                name: vehicle.name,
                vehicle_image: vehicle.vehicle_image,
                vehicle: `${vehicle.make} ${vehicle.model}`,
                status: isOnline ? 'online' : 'offline',
                coordinate: {
                    latitude: position ? parseFloat(position.latitude) : null,
                    longitude: position ? parseFloat(position.longitude) : null
                },
                speed: position ? parseFloat(position.speed) : 0,
                course: position ? parseFloat(position.course) : 0,
                lastUpdate: position ? position.device_time : null,
                plateNumber: vehicle.plate_number,
                attributes: {
                    ...position?.attributes,
                    deviceSerial: vehicle.device_serial_number
                }
            };
        });

        res.status(200).json(formattedLocations);

        } catch (error) {
            console.error('Error fetching vehicle locations:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to fetch vehicle locations',
                error: error.message 
            });
        }
    }
}

module.exports = new LocationController(); 