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
        
        return diffMinutes <= 1;
    }

    async getVehicleLocations(req, res) {
        try {
            const vehiclesResult = await sequelize.query(`
                SELECT 
                    v.*,
                    tdc.traccar_id,
                    tdc.status_changed_at,
                    d.first_name,
                    d.last_name,
                    d.profile_image as driver_image,
                    d.updated_at as driver_login_time,
                    CASE 
                        WHEN d.id IS NOT NULL THEN EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - d.updated_at))/3600
                        ELSE NULL 
                    END as hours_since_login,
                    t.id as trip_id,
                    t.title as trip_title,
                    t.status as trip_status,
                    t.scheduled_start,
                    t.scheduled_end,
                    t.start_location,
                    t.end_location
                FROM 
                    vehicles v
                    INNER JOIN device_vehicle_assignments dva ON v.id = dva.vehicle_id
                    INNER JOIN traccar_device_configs tdc ON dva.device_serial_number = tdc.device_serial_number
                    LEFT JOIN drivers d ON v.id = d.current_vehicle_id
                    LEFT JOIN trips t ON v.id = t.vehicle_id
                        AND (
                            t.status IN ('scheduled', 'in_progress')
                            OR (
                                CURRENT_TIMESTAMP BETWEEN t.scheduled_start AND t.scheduled_end
                            )
                        )
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
            WITH LastStatusChanges AS (
                SELECT device_id, status, changed_at
                FROM device_status_changes
                WHERE id IN (
                    SELECT MAX(id)
                    FROM device_status_changes
                    GROUP BY device_id
                )
            )
            SELECT DISTINCT ON (p.device_id)
                p.*,
                lsc.status as device_status,
                lsc.changed_at as status_changed_at,
                EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - lsc.changed_at))/3600 as hours_since_status_change
            FROM 
                positions p
                INNER JOIN devices d ON p.device_id = d.id
                LEFT JOIN LastStatusChanges lsc ON d.id = lsc.device_id
            WHERE 
                p.device_id IN (:traccarIds)
            ORDER BY 
                p.device_id, p.device_time DESC
        `, {
            replacements: { traccarIds: vehicles.map(v => v.traccar_id) }
        });

        const positions = Array.isArray(positionsResult[0]) ? positionsResult[0] : [];

        const formatDateTime = (dateTimeString) => {
            if (!dateTimeString) return null;
            const date = new Date(dateTimeString);
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        };

        const formattedLocations = vehicles.map(vehicle => {
            const position = positions.find(p => p.device_id === parseInt(vehicle.traccar_id));
            const isOnline = position?.device_status === 'online';
            
            return {
                id: vehicle.id,
                name: vehicle.name,
                vehicle_image: vehicle.vehicle_image,
                vehicle: `${vehicle.make} ${vehicle.model}`,
                status: isOnline ? 'online' : 'offline',
                statusTime: formatDateTime(position?.status_changed_at),
                hoursSinceStatus: position?.hours_since_status_change || 0,
                coordinate: {
                    latitude: position ? parseFloat(position.latitude) : null,
                    longitude: position ? parseFloat(position.longitude) : null
                },
                speed: position ? parseFloat(position.speed) : 0,
                course: position ? parseFloat(position.course) : 0,
                lastUpdate: position ? position.device_time : null,
                plateNumber: vehicle.plate_number,
                currentDriver: isOnline ? (vehicle.first_name ? {
                    name: `${vehicle.first_name} ${vehicle.last_name}`,
                    image: vehicle.driver_image,
                    loginTime: formatDateTime(vehicle.driver_login_time),
                    statusTime: formatDateTime(position?.status_changed_at),
                    hoursActive: vehicle.hours_since_login ? 
                        Math.round(vehicle.hours_since_login * 10) / 10 : 0
                } : {
                    name: "Unknown",
                    image: "https://i.imgur.com/cRSm6eI.png",
                    statusTime: formatDateTime(position?.status_changed_at),
                    hoursActive: vehicle.hours_since_login ? 
                        Math.round(vehicle.hours_since_login * 10) / 10 : 0
                }) : {
                    name: "None",
                    image: "https://i.imgur.com/cRSm6eI.png",
                    loginTime: null,
                    hoursActive: 0
                },
                attributes: {
                    ...position?.attributes,
                    deviceSerial: vehicle.device_serial_number
                },
                currentTrip: vehicle.trip_id ? {
                    id: vehicle.trip_id,
                    title: vehicle.trip_title,
                    status: vehicle.trip_status,
                    scheduled_start: vehicle.scheduled_start,
                    scheduled_end: vehicle.scheduled_end,
                    start_location: vehicle.start_location,
                    end_location: vehicle.end_location
                } : null
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