const traccarService = require('../services/traccarService');
const deviceService = require('../services/deviceService');
const positionService = require('../services/positionService');

class TestController {
  async syncData(req, res) {
    try {
      // جلب الأجهزة من Traccar
      const devices = await traccarService.getDevices();
      console.log(`Fetched ${devices.length} devices from Traccar`);

      // حفظ الأجهزة في قاعدة بياناتنا
      for (const device of devices) {
        await deviceService.upsertDevice(device);
      }

      // جلب المواقع من Traccar
      const positions = await traccarService.getPositions();
      console.log(`Fetched ${positions.length} positions from Traccar`);

      // حفظ المواقع في قاعدة بياناتنا
      await positionService.savePositions(positions);

      res.json({
        success: true,
        devicesCount: devices.length,
        positionsCount: positions.length
      });
    } catch (error) {
      console.error('Error in syncData:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new TestController(); 