const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// ... existing code ...
class Driver extends Model {}

Driver.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.UUID,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  accountId: {
    type: DataTypes.INTEGER,
    field: 'account_id',
    references: {
      model: 'independent_driver_accounts',
      key: 'id'
    },
    allowNull: true // تأكد من السماح بالقيمة null إذا كانت غير متاحة
  },
  driverType: {
    type: DataTypes.ENUM('company', 'independent'),
    field: 'driver_type',
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING(50),
    field: 'first_name',
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(50),
    field: 'last_name',
    allowNull: false
  },
  idNumber: {
    type: DataTypes.STRING(20),
    field: 'id_number',
    unique: true,
    allowNull: false
  },
  birthDate: {
    type: DataTypes.DATE,
    field: 'birth_date',
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100)
  },
  address: {
    type: DataTypes.TEXT
  },
  profileImage: {
    type: DataTypes.STRING(255),
    field: 'profile_image'
  },
  emergencyContact: {
    type: DataTypes.JSONB,
    field: 'emergency_contact'
  },
  currentLocation: {
    type: DataTypes.GEOMETRY('Point', 4326),
    field: 'current_location',
    allowNull: true // تأكد من السماح بالقيمة null إذا كانت غير متاحة
  },
  licenseNumber: {
    type: DataTypes.STRING(50),
    field: 'license_number',
    allowNull: false
  },
  licenseType: {
    type: DataTypes.ENUM('light', 'medium', 'heavy', 'hazmat', 'special'),
    field: 'license_type',
    allowNull: false
  },
  licenseExpiry: {
    type: DataTypes.DATE,
    field: 'license_expiry',
    allowNull: false
  },
  licenseIssueDate: {
    type: DataTypes.DATE,
    field: 'license_issue_date',
    allowNull: false
  },
  hazmatCertified: {
    type: DataTypes.BOOLEAN,
    field: 'hazmat_certified',
    defaultValue: false
  },
  experienceYears: {
    type: DataTypes.INTEGER,
    field: 'experience_years'
  },
  hireDate: {
    type: DataTypes.DATE,
    field: 'hire_date'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'on_trip', 'on_leave', 'suspended', 'terminated'),
    defaultValue: 'inactive'
  },
  approvalStatus: {
    type: DataTypes.ENUM('pending_review', 'approved', 'rejected'),
    field: 'approval_status',
    defaultValue: 'pending_review'
  },
  currentVehicleId: {
    type: DataTypes.INTEGER,
    field: 'current_vehicle_id',
    references: {
      model: 'vehicles',
      key: 'id'
    },
    allowNull: true // تأكد من السماح بالقيمة null إذا كانت غير متاحة
  },
  totalTrips: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalDistance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    validate: {
      min: 0,
      max: 5
    }
  },
  employmentStatus: {
    type: DataTypes.STRING(20),
    field: 'employment_status'
  },
  preferences: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  skills: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  documents: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  certifications: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Driver',
  tableName: 'drivers',
  timestamps: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['license_number']
    },
    {
      fields: ['status']
    }
  ]
});
// ... existing code ...

module.exports = Driver;