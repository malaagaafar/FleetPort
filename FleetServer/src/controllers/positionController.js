const { sequelize } = require('../config/database');
const systemDb = require('../config/systemDb');


exports.getVehiclePositions = async (req, res) => {
  try {
    const { deviceId, from, to } = req.query;
    
    // تحويل الأوقات إلى كائنات Date
    const fromDate = new Date('2024-12-07T20:46:30.618Z');
    const toDate = new Date('2024-12-08T20:46:30.618Z');
    
    // تسجيل الأوقات بتنسيق ISO
    //console.log('Device ID:', deviceId);
    //console.log('From:', fromDate.toISOString());
    //console.log('To:', toDate.toISOString());
    
    const query = `
      SELECT 
        p.id,
        p.device_id,
        p.latitude,
        p.longitude,
        p.speed,
        p.device_time,
        p.address
      FROM positions p
      WHERE p.device_id = :deviceId
        AND p.device_time BETWEEN :from AND :to
        AND p.valid = true
      ORDER BY p.device_time ASC
    `;

    const positions = await systemDb.query(query, {
      replacements: { deviceId, from: fromDate, to: toDate },
      type: sequelize.QueryTypes.SELECT
    });

    res.json(positions);
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({ message: 'Error fetching positions' });
  }
}; 