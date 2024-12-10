const axios = require('axios');
const jwt = require('jsonwebtoken');

class FleetSystemService {
  constructor() {
    this.baseURL = process.env.FLEET_SYSTEM_URL || 'http://localhost:3001';
    this.apiSecret = process.env.SYSTEM_API_SECRET;
  }

  // إنشاء توكن للتواصل مع FleetSystem
  generateSystemToken() {
    return jwt.sign(
      { 
        serverId: 'fleet_server',
        timestamp: Date.now() 
      }, 
      this.apiSecret,
      { expiresIn: '1h' }
    );
  }

  // تهيئة طلب HTTP
  getRequestConfig() {
    return {
      headers: {
        Authorization: `Bearer ${this.generateSystemToken()}`
      }
    };
  }

  // الحصول على آخر موقع لجهاز
  async getLastPosition(deviceId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/positions/last/${deviceId}`,
        this.getRequestConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching last position:', error);
      throw error;
    }
  }

  // الحصول على مواقع في فترة زمنية
  async getPositionsInTimeRange(deviceId, startTime, endTime) {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/positions/range`,
        {
          ...this.getRequestConfig(),
          params: { deviceId, startTime, endTime }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching positions:', error);
      throw error;
    }
  }
}

module.exports = FleetSystemService; 