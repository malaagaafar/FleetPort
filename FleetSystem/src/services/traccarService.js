const axios = require('axios');

class TraccarService {
  constructor() {
    this.baseURL = process.env.TRACCAR_API_URL;
    this.headers = {
      'Authorization': `Bearer ${process.env.TRACCAR_API_TOKEN}`
    };
  }

  async getDevices() {
    try {
      const response = await axios.get(`${this.baseURL}/devices`, {
        headers: this.headers
      });
      console.log('Devices response:', response.data); // للتأكد من البيانات
      return response.data;
    } catch (error) {
      console.error('Error fetching devices from Traccar:', error.response?.data || error.message);
      throw error;
    }
  }

  async getPositions() {
    try {
      const response = await axios.get(`${this.baseURL}/positions`, {
        headers: this.headers
      });
      console.log('Positions response:', response.data); // للتأكد من البيانات
      return response.data;
    } catch (error) {
      console.error('Error fetching positions from Traccar:', error.response?.data || error.message);
      throw error;
    }
  }

  async createSession() {
    try {
      console.log('Creating session with token...');
      const response = await axios.get(`${this.baseURL}/session`, {
        params: {
          token: process.env.TRACCAR_API_TOKEN
        }
      });
      
      // التحقق من وجود الكوكيز
      const cookies = response.headers['set-cookie'];
      if (!cookies) {
        throw new Error('No cookies received from Traccar');
      }
      
      console.log('Session created successfully');
      return cookies;
    } catch (error) {
      console.error('Error creating session:', error.message);
      throw error;
    }
  }
}

module.exports = new TraccarService(); 