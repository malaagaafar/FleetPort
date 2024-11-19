const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Driver extends Model {}

Driver.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  companyId: {
    type: DataTypes.INTEGER,
    field: 'company_id',
    allowNull: false,
    references: {
      model: 'companies',
      key: 'id'
    }
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
  licenseNumber: {
    type: DataTypes.STRING(20),
    field: 'license_number',
    unique: true,
    allowNull: false
  },
  licenseExpiry: {
    type: DataTypes.DATE,
    field: 'license_expiry'
  },
  phone: {
    type: DataTypes.STRING(20),
    validate: {
      is: /^[0-9+\-\s()]*$/i
    }
  },
  email: {
    type: DataTypes.STRING(100),
    validate: {
      isEmail: true
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active'
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    field: 'date_of_birth'
  },
  address: {
    type: DataTypes.TEXT
  },
  emergencyContact: {
    type: DataTypes.JSONB,
    field: 'emergency_contact'
  },
  certifications: {
    type: DataTypes.JSONB,
    defaultValue: []
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
  modelName: 'Driver',
  tableName: 'drivers',
  timestamps: true,
  indexes: [
    {
      fields: ['company_id']
    },
    {
      fields: ['license_number']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Driver;