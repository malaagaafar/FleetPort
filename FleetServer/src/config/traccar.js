require('dotenv').config();

module.exports = {
  // إعدادات الاتصال بخادم Traccar
  traccarUrl: process.env.TRACCAR_URL || 'http://localhost:8082',
  username: process.env.TRACCAR_USERNAME,
  password: process.env.TRACCAR_PASSWORD,
  
  // إعدادات API
  apiVersion: '/api/v1',
  
  // إعدادات الاتصال
  connectionTimeout: 5000, // بالميلي ثانية
  requestTimeout: 10000,  // بالميلي ثانية
  
  // إعدادات التحديث
  updateInterval: 5000,   // تحديث موقع المركبة كل 5 ثواني
  
  // إعدادات التنبيهات
  alerts: {
    speedLimit: 120,      // كم/ساعة
    idleTimeout: 300,     // 5 دقائق
    geofenceRadius: 100   // متر
  },
  
  // تكوين المستشعرات
  sensors: {
    fuel: {
      enabled: true,
      protocol: 'custom',
      dataKey: 'fuel'
    },
    temperature: {
      enabled: true,
      protocol: 'custom',
      dataKey: 'temp'
    },
    engine: {
      enabled: true,
      protocol: 'custom',
      dataKey: 'engine'
    }
  },
  
  // تكوين البروتوكولات المدعومة
  protocols: [
    'tk103',
    'gt06',
    'h02',
    'teltonika',
    'meitrack'
  ],
  
  // إعدادات التقارير
  reports: {
    maxPeriod: 30,       // أقصى فترة للتقارير بالأيام
    maxPoints: 10000     // أقصى عدد نقاط في التقرير
  }
};