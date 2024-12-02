const axios = require('axios');
const driverController = require('../controllers/driverController');

const traccarApi = axios.create({
  baseURL: process.env.TRACCAR_API_URL,
  headers: {
    'Authorization': `Bearer ${process.env.TRACCAR_API_TOKEN}`,
    'Content-Type': 'application/json',
  }
});

const createTraccarDevice = async (deviceData) => {
  try {
    console.log('Attempting to create Traccar device with data:', deviceData);
    console.log('Using Traccar API URL:', process.env.TRACCAR_API_URL);
    
    const response = await traccarApi.post('/devices', deviceData);
    console.log('Traccar API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Traccar API Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data,
      }
    });
    
    // رمي خطأ أكثر تفصيلاً
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'فشل في إنشاء الجهاز في نظام التتبع'
    );
  }
};

const getTraccarDeviceStatus = async (deviceId) => {
  try {
    console.log('Fetching device status for ID:', deviceId);
    
    const response = await traccarApi.get(`/devices/${deviceId}`);
    console.log('Device status response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching device status:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'فشل في جلب حالة الجهاز'
    );
  }
};

module.exports = {
  createTraccarDevice,
  getTraccarDeviceStatus
};