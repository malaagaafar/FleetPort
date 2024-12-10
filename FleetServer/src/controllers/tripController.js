const { sequelize } = require('../config/database');
const NotificationService = require('../services/notificationService');

exports.getAllTrips = async (req, res) => {
  const userId = req.query.userId; // الحصول على userId من استعلام الطلب

  try {
    const query = `
      SELECT 
        t.*,
        json_build_object(
          'id', v.id,
          'name', v.name,
          'plate_number', v.plate_number,
          'vehicle_image', v.vehicle_image
        ) as vehicle,
        json_build_object(
          'id', d.id,
          'first_name', d.first_name,
          'last_name', d.last_name,
          'profile_image', d.profile_image
        ) as driver
      FROM trips t
      LEFT JOIN vehicles v ON t.vehicle_id = v.id
      LEFT JOIN drivers d ON t.driver_id = d.id
      WHERE t.user_id = :userId
      ORDER BY t.scheduled_start DESC
    `;

    const trips = await sequelize.query(query, {
      replacements: { userId: userId },
      type: sequelize.QueryTypes.SELECT
    });

    console.log('Fetched trips:', trips);

    res.json(trips);
  } catch (error) {
    console.error('Error in getAllTrips:', error);
    res.status(500).json({ message: 'Error fetching trips' });
  }
};

exports.createTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  //const userId = req.body.user_id;

  try {
    console.log('Creating trip with data:', req.body);

    // التحقق من البيانات المطلوبة
    if (!req.body.title || !req.body.vehicle_id || !req.body.driver_id || 
        !req.body.start_location || !req.body.end_location) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['title', 'vehicle_id', 'driver_id', 'start_location', 'end_location'],
        received: Object.keys(req.body)
      });
    }

    // إنشاء الرحلة
    const insertQuery = `
      INSERT INTO trips (
        reference_number,
        user_id,
        vehicle_id,
        driver_id,
        type,
        status,
        title,
        description,
        scheduled_start,
        scheduled_end,
        start_location,
        end_location,
        estimated_distance,
        estimated_duration,
        priority,
        cost,
        revenue,
        notes,
        created_at,
        updated_at
      ) VALUES (
        :reference_number,
        :user_id,
        :vehicle_id,
        :driver_id,
        :type,
        :status,
        :title,
        :description,
        :scheduled_start,
        :scheduled_end,
        ST_SetSRID(ST_MakePoint(:start_lng, :start_lat), 4326),
        ST_SetSRID(ST_MakePoint(:end_lng, :end_lat), 4326),
        :estimated_distance,
        :estimated_duration,
        :priority,
        :cost,
        :revenue,
        :notes,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      ) RETURNING *;
    `;

    const [result] = await sequelize.query(insertQuery, {
      replacements: {
        reference_number: req.body.reference_number,
        user_id: req.body.user_id,
        vehicle_id: req.body.vehicle_id,
        driver_id: req.body.driver_id,
        type: req.body.type || 'delivery',
        status: req.body.status || 'scheduled',
        title: req.body.title,
        description: req.body.description || '',
        scheduled_start: req.body.scheduled_start,
        scheduled_end: req.body.scheduled_end,
        start_lng: req.body.start_location.coordinates[0],
        start_lat: req.body.start_location.coordinates[1],
        end_lng: req.body.end_location.coordinates[0],
        end_lat: req.body.end_location.coordinates[1],
        estimated_distance: req.body.estimated_distance || 0,
        estimated_duration: req.body.estimated_duration || 0,
        priority: req.body.priority || 0,
        cost: req.body.cost || 0,
        revenue: req.body.revenue || 0,
        notes: req.body.notes || ''
      },
      type: sequelize.QueryTypes.INSERT,
      transaction
    });

    await transaction.commit();

    res.status(201).json({ 
      message: 'Trip created successfully',
      trip: result[0]
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Detailed error:', error);
    res.status(500).json({ 
      message: 'Error creating trip',
      error: error.message 
    });
  }
};

exports.getVehiclesForAssignment = async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        name,
        plate_number,
        vehicle_image,
        type,
        status
      FROM vehicles
      WHERE user_id = :userId
      AND status = 'active'
      ORDER BY name
    `;

    const vehicles = await sequelize.query(query, {
      replacements: { userId: req.user.id },
      type: sequelize.QueryTypes.SELECT
    });

    res.json({ vehicles });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Error fetching vehicles' });
  }
};

exports.getDriversForAssignment = async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        first_name,
        last_name,
        profile_image,
        driver_type,
        status
      FROM drivers
      WHERE user_id = :userId
      AND status = 'active'
      ORDER BY first_name, last_name
    `;

    const drivers = await sequelize.query(query, {
      replacements: { userId: req.user.id },
      type: sequelize.QueryTypes.SELECT
    });

    res.json({ drivers });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ message: 'Error fetching drivers' });
  }
};