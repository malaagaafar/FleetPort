const axios = require('axios');

const traccarApi_test = axios.create({
    baseURL: 'https://demo.traccar.org/api',
    headers: {
      'Authorization': `Bearer RzBFAiEAwxLrRq19sIxQIqzoTRMcYFzPPrr7NDzaQp-5esqmheoCIGGwnutfOi_xP9JvnZoLsKHTz1VpXXYsMWUNyvIMXo8reyJ1Ijo2Mzg2MiwiZSI6IjIwMjQtMTItMDdUMDU6MDA6MDAuMDAwKzAwOjAwIn0`,
      'Content-Type': 'application/json',
    }
  });

const logTraccarDeviceData = async () => {
  try {
    //console.log('Fetching device data for ID:', );
    
    const response = await traccarApi_test.get(`/devices/9782`);
    console.log('Device data:', response.data);
    
    // يمكنك إضافة المزيد من المعالجة هنا إذا لزم الأمر
  } catch (error) {
    console.error('Error fetching device data:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
};

// استدعاء الدالة مع معرف الجهاز
logTraccarDeviceData();