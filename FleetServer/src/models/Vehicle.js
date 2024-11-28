const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Vehicle extends Model {}

Vehicle.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.UUID,
    field: 'user_id',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM(
      'truck',
      'van',
      'pickup',
      'refrigerated',
      'tanker',
      'trailer',
      'car',
      'bus',
      'trailer_head'
    ),
    allowNull: false
  },
  plateNumber: {
    type: DataTypes.STRING(20),
    field: 'plate_number',
    unique: true,
    allowNull: false
  },
  make: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  model: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1900,
      max: new Date().getFullYear() + 1
    }
  },
  vin: {
    type: DataTypes.STRING(50),
    unique: true,
    validate: {
      len: [1, 50]
    }
  },
  registrationNumber: {
    type: DataTypes.STRING(50),
    field: 'registration_number'
  },
  registrationExpiry: {
    type: DataTypes.DATE,
    field: 'registration_expiry'
  },
  insuranceNumber: {
    type: DataTypes.STRING(50),
    field: 'insurance_number'
  },
  insuranceExpiry: {
    type: DataTypes.DATE,
    field: 'insurance_expiry'
  },
  status: {
    type: DataTypes.ENUM(
      'on_trip',        // في رحلة حالياً
      'active',         // متصل ومتاح
      'parked',         // متوقف في منطقة وقوف
      'inactive',       // غير متصل
      'maintenance',    // في الصيانة
      'temp_inactive',  // موقوف مؤقتاً
      'retired',        // خارج الخدمة نهائياً
      'out_of_service', // خارج الخدمة
      'reserved'        // محجوز
    ),
    defaultValue: 'inactive' // القيمة الافتراضية
  },
  lastMaintenanceDate: {
    type: DataTypes.DATE,
    field: 'last_maintenance_date'
  },
  nextMaintenanceDate: {
    type: DataTypes.DATE,
    field: 'next_maintenance_date'
  },
  mileage: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  fuelType: {
    type: DataTypes.ENUM('petrol', 'diesel', 'electric', 'hybrid'),
    field: 'fuel_type'
  },
  fuelCapacity: {
    type: DataTypes.DECIMAL(6, 2),
    field: 'fuel_capacity'
  },
  maxLoadWeight: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'max_load_weight'
  },
  fuelTankCapacity: {
    type: DataTypes.INTEGER,
    field: 'fuel_tank_capacity'
  },
  currentOdometer: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  documents: {
    type: DataTypes.JSONB,
    defaultValue: '[]'
  },
  notes: {
    type: DataTypes.TEXT
  },
  specifications: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at'
  }
}, {
  sequelize,
  modelName: 'Vehicle',
  tableName: 'vehicles',
  timestamps: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['plate_number']
    },
    {
      fields: ['status']
    }
  ]
});
(async () => {
  await sequelize.sync();
})();

module.exports = Vehicle;