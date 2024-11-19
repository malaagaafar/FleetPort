module.exports = {
    // حالات المركبات
    VEHICLE_STATUS: {
      ACTIVE: 'active',
      MAINTENANCE: 'maintenance',
      INACTIVE: 'inactive'
    },
  
    // حالات السائقين
    DRIVER_STATUS: {
      ACTIVE: 'active',
      INACTIVE: 'inactive',
      ON_LEAVE: 'onLeave'
    },
  
    // حالات الرحلات
    TRIP_STATUS: {
      PLANNED: 'planned',
      IN_PROGRESS: 'inProgress',
      COMPLETED: 'completed',
      CANCELLED: 'cancelled'
    },
  
    // أنواع التنبيهات
    ALERT_TYPES: {
      SPEED: 'speed',
      GEOFENCE: 'geofence',
      MAINTENANCE: 'maintenance',
      SENSOR: 'sensor',
      BATTERY: 'battery',
      CUSTOM: 'custom'
    },
  
    // مستويات الخطورة
    SEVERITY_LEVELS: {
      LOW: 'low',
      MEDIUM: 'medium',
      HIGH: 'high',
      CRITICAL: 'critical'
    },
  
    // أدوار المستخدمين
    USER_ROLES: {
      ADMIN: 'admin',
      MANAGER: 'manager',
      DISPATCHER: 'dispatcher',
      VIEWER: 'viewer'
    },
  
    // حدود النظام
    LIMITS: {
      MAX_VEHICLES_PER_COMPANY: 1000,
      MAX_DRIVERS_PER_COMPANY: 2000,
      MAX_TRIPS_PER_DAY: 500,
      MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    },
  
    // إعدادات الخريطة
    MAP_SETTINGS: {
      DEFAULT_CENTER: [24.7136, 46.6753], // الرياض
      DEFAULT_ZOOM: 12,
      GEOFENCE_RADIUS: 100 // متر
    },
  
    // أنواع المركبات
    VEHICLE_TYPES: [
      'SEDAN',
      'SUV',
      'VAN',
      'TRUCK',
      'BUS'
    ],
  
    // وحدات القياس
    UNITS: {
      DISTANCE: 'km',
      SPEED: 'km/h',
      FUEL: 'liter',
      TEMPERATURE: 'celsius'
    }
  };