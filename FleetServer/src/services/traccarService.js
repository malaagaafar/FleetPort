const axios = require('axios');
const config = require('../config/traccar');
const logger = require('../utils/logger');

class TraccarService {
  constructor() {
    this.client = axios.create({
      baseURL: config.traccarUrl,
      auth: {
        username: config.username,
        password: config.password
      },
      timeout: config.requestTimeout
    });
  }

  async getDevicePosition(deviceId) {
    try {
      const response = await this.client.get(`/api/positions/${deviceId}`);
      return this.formatPosition(response.data);
    } catch (error) {
      logger.error('Failed to get device position', {
        deviceId,
        error: error.message
      });
      throw new Error('Failed to get device position');
    }
  }

  async getDeviceStatus(deviceId) {
    try {
      const response = await this.client.get(`/api/devices/${deviceId}`);
      return this.formatDeviceStatus(response.data);
    } catch (error) {
      logger.error('Failed to get device status', {
        deviceId,
        error: error.message
      });
      throw new Error('Failed to get device status');
    }
  }

  async registerDevice(deviceData) {
    try {
      const response = await this.client.post('/api/devices', {
        name: deviceData.name,
        uniqueId: deviceData.serialNumber,
        phone: deviceData.phone,
        model: deviceData.model,
        category: deviceData.type
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to register device', {
        deviceData,
        error: error.message
      });
      throw new Error('Failed to register device');
    }
  }

  async updateDeviceConfiguration(deviceId, config) {
    try {
      await this.client.put(`/api/devices/${deviceId}`, config);
    } catch (error) {
      logger.error('Failed to update device configuration', {
        deviceId,
        error: error.message
      });
      throw new Error('Failed to update device configuration');
    }
  }

  async getDeviceHistory(deviceId, from, to) {
    try {
      const response = await this.client.get('/api/positions', {
        params: {
          deviceId,
          from: from.toISOString(),
          to: to.toISOString()
        }
      });
      return response.data.map(this.formatPosition);
    } catch (error) {
      logger.error('Failed to get device history', {
        deviceId,
        error: error.message
      });
      throw new Error('Failed to get device history');
    }
  }

  formatPosition(data) {
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      speed: data.speed,
      course: data.course,
      altitude: data.altitude,
      accuracy: data.accuracy,
      timestamp: new Date(data.fixTime),
      attributes: {
        fuel: data.attributes.fuel,
        battery: data.attributes.battery,
        ignition: data.attributes.ignition,
        motion: data.attributes.motion
      }
    };
  }

  formatDeviceStatus(data) {
    return {
      id: data.id,
      status: data.status,
      lastUpdate: new Date(data.lastUpdate),
      disabled: data.disabled,
      online: data.status === 'online',
      attributes: data.attributes
    };
  }

  async setupGeofence(geofenceData) {
    try {
      const response = await this.client.post('/api/geofences', {
        name: geofenceData.name,
        description: geofenceData.description,
        area: geofenceData.area
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to setup geofence', {
        geofenceData,
        error: error.message
      });
      throw new Error('Failed to setup geofence');
    }
  }
}

module.exports = new TraccarService();