const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Notification extends Model {}

Notification.init({
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
  type: {
    type: DataTypes.ENUM(
      'alert',
      'warning',
      'info',
      'maintenance',
      'system',
      'report'
    ),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium'
  },
  status: {
    type: DataTypes.ENUM('unread', 'read', 'archived'),
    defaultValue: 'unread'
  },
  recipientId: {
    type: DataTypes.INTEGER,
    field: 'recipient_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  data: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  relatedType: {
    type: DataTypes.STRING(50),
    field: 'related_type'
  },
  relatedId: {
    type: DataTypes.INTEGER,
    field: 'related_id'
  },
  readAt: {
    type: DataTypes.DATE,
    field: 'read_at'
  },
  expiresAt: {
    type: DataTypes.DATE,
    field: 'expires_at'
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
  modelName: 'Notification',
  tableName: 'notifications',
  timestamps: true,
  indexes: [
    {
      fields: ['company_id']
    },
    {
      fields: ['recipient_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['created_at']
    }
  ]
});

module.exports = Notification;