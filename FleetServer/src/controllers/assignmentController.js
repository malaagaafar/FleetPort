const { sequelize } = require('../config/database');

const driverVehiclesAssignment = async (req, res) => {
    try {
        const {
            vehicleId,
            driverId,
            isPrimary,
            assignmentOrder,
            startDate,
            endDate
        } = req.body;

        // التحقق من البيانات المطلوبة
        if (!vehicleId || !driverId || assignmentOrder === undefined) {
            return res.status(400).json({
                success: false,
                message: 'جميع الحقول المطلوبة يجب ملؤها'
            });
        }

        // إنشاء التعيين
        const assignment = await sequelize.query(`
            INSERT INTO drivers_vehicle_assignments (
                vehicle_id, 
                driver_id, 
                is_primary,
                assignment_order,
                start_date,
                end_date,
                status
            ) VALUES (
                :vehicleId,
                :driverId,
                :isPrimary,
                :assignmentOrder,
                :startDate,
                :endDate,
                'active'
            ) RETURNING *
        `, {
            replacements: {
                vehicleId,
                driverId,
                isPrimary,
                assignmentOrder,
                startDate: startDate || new Date(),
                endDate: endDate || null
            },
            type: sequelize.QueryTypes.INSERT
        });

        return res.status(201).json({
            success: true,
            message: 'تم إنشاء التعيين بنجاح',
            assignment: assignment[0][0]
        });

    } catch (error) {
        console.error('Error creating assignment:', error);
        return res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء إنشاء التعيين',
            error: error.message
        });
    }
}; 

const getDriversAssignment = async (req, res) => {
    try {
        const drivers = await sequelize.query(`
            SELECT 
                d.*,
                COALESCE(v.name, '') as vehicle_name,
                COALESCE(v.make, '') as vehicle_make,
                COALESCE(v.model, '') as vehicle_model,
                COALESCE(v.plate_number, '') as vehicle_plate_number,
                COALESCE(dva.is_primary, false) as is_primary,
                COALESCE(dva.assignment_order, 0) as assignment_order
            FROM 
                drivers d
            LEFT JOIN drivers_vehicle_assignments dva ON d.id = dva.driver_id 
                AND dva.status = 'active'
            LEFT JOIN vehicles v ON dva.vehicle_id = v.id
            WHERE 
                d.user_id = :userId
            ORDER BY 
                d.id, dva.assignment_order
        `, {
            replacements: { 
                userId: req.query.userId 
            },
            type: sequelize.QueryTypes.SELECT
        });

        res.status(200).json(drivers);

    } catch (error) {
        console.error('Error fetching drivers:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch drivers' 
        });
    }
};

const getVehiclesAssignment = async (req, res) => {
    try {
        const vehicles = await sequelize.query(`
            SELECT 
                v.*,
                COALESCE(d.name, '') as device_name,
                COALESCE(d.model, '') as device_model,
                COALESCE(dva.device_serial_number, '') as device_serial_number,
                COALESCE(dva.created_at, null) as assignment_date
            FROM 
                vehicles v
            LEFT JOIN device_vehicle_assignments dva ON v.id = dva.vehicle_id 
            LEFT JOIN purchased_devices pd ON dva.device_serial_number = pd.serial_number
            LEFT JOIN primary_devices d ON pd.device_id = d.id
            WHERE 
                v.user_id = :userId
            ORDER BY 
                v.id, dva.created_at
        `, {
            replacements: { 
                userId: req.query.userId 
            },
            type: sequelize.QueryTypes.SELECT
        });

        res.status(200).json(vehicles);

    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch vehicles' 
        });
    }
};

module.exports = {
    driverVehiclesAssignment,
    getDriversAssignment,
    getVehiclesAssignment
}