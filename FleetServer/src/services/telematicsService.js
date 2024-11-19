const axios = require('axios');
const config = require('../config/traccar');

class TelematicsService {
  constructor() {
    this.client = axios.create({
      baseURL: config.traccarUrl,
      auth: {
        username: config.username,
        password: config.password
      }
    });
  }

  async getVehicleLocation(deviceId) {
    try {
      const response = await this.client.get(`/positions/${deviceId}`);
      return {
        latitude: response.data.latitude,
        longitude: response.data.longitude,
        speed: response.data.speed,
        timestamp: response.data.timestamp
      };
    } catch (error) {
      throw new Error('Failed to fetch vehicle location');
    }
  }

  async getVehicleStatus(deviceId) {
    try {
      const response = await this.client.get(`/devices/${deviceId}`);
      return {
        status: response.data.status,
        lastUpdate: response.data.lastUpdate
      };
    } catch (error) {
      throw new Error('Failed to fetch vehicle status');
    }
  }
}

module.exports = new TelematicsService();