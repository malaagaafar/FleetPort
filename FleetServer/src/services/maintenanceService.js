const Vehicle = require('../models/Vehicle');
const MaintenanceRecord = require('../models/MaintenanceRecord');
const NotificationService = require('./notificationService');
const logger = require('../utils/logger');

class MaintenanceService {
  async scheduleMaintenanceCheck(vehicleId, maintenanceType, scheduledDate) {
    try {
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        throw new Error('المركبة غير موجودة');
      }

      const maintenanceRecord = new MaintenanceRecord({
        vehicle: vehicleId,
        company: vehicle.company,
        type: maintenanceType,
        scheduledDate,
        status: 'scheduled'
      });

      await maintenanceRecord.save();

      // إرسال إشعارات للمسؤولين
      await NotificationService.sendAlert({
        type: 'maintenance',
        severity: 'low',
        company: vehicle.company,
        vehicle: vehicleId,
        message: `تم جدولة فحص صيانة جديد للمركبة ${vehicle.plateNumber}`,
        metadata: {
          maintenanceId: maintenanceRecord._id,
          type: maintenanceType,
          scheduledDate
        }
      });

      return maintenanceRecord;
    } catch (error) {
      logger.error('Failed to schedule maintenance check:', {
        vehicleId,
        error: error.message
      });
      throw error;
    }
  }

  async updateMaintenanceStatus(recordId, status, details) {
    try {
      const record = await MaintenanceRecord.findById(recordId)
        .populate('vehicle');
      
      if (!record) {
        throw new Error('سجل الصيانة غير موجود');
      }

      record.status = status;
      record.details = details;
      
      if (status === 'completed') {
        record.completedDate = new Date();
        
        // تحديث معلومات المركبة
        await Vehicle.findByIdAndUpdate(record.vehicle._id, {
          $set: {
            lastMaintenanceDate: new Date(),
            nextMaintenanceDate: this.calculateNextMaintenanceDate(record.type)
          }
        });
      }

      await record.save();

      // إرسال إشعار بتحديث حالة الصيانة
      await NotificationService.sendAlert({
        type: 'maintenance',
        severity: 'low',
        company: record.company,
        vehicle: record.vehicle._id,
        message: `تم تحديث حالة الصيانة للمركبة ${record.vehicle.plateNumber} إلى ${status}`,
        metadata: {
          maintenanceId: record._id,
          status,
          details
        }
      });

      return record;
    } catch (error) {
      logger.error('Failed to update maintenance status:', {
        recordId,
        error: error.message
      });
      throw error;
    }
  }

  calculateNextMaintenanceDate(maintenanceType) {
    const today = new Date();
    switch (maintenanceType) {
      case 'routine':
        return new Date(today.setMonth(today.getMonth() + 3));
      case 'major':
        return new Date(today.setMonth(today.getMonth() + 6));
      case 'inspection':
        return new Date(today.setMonth(today.getMonth() + 1));
      default:
        return new Date(today.setMonth(today.getMonth() + 3));
    }
  }

  async getMaintenanceHistory(vehicleId, filters = {}) {
    try {
      const query = { vehicle: vehicleId };

      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.dateRange) {
        query.scheduledDate = {
          $gte: filters.dateRange.start,
          $lte: filters.dateRange.end
        };
      }

      const records = await MaintenanceRecord.find(query)
        .sort('-scheduledDate')
        .populate('vehicle', 'plateNumber make model');

      return records;
    } catch (error) {
      logger.error('Failed to get maintenance history:', {
        vehicleId,
        error: error.message
      });
      throw error;
    }
  }

  async checkMaintenanceAlerts() {
    try {
      const vehicles = await Vehicle.find({
        nextMaintenanceDate: {
          $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 أيام
        }
      });

      for (const vehicle of vehicles) {
        await NotificationService.sendAlert({
          type: 'maintenance',
          severity: 'medium',
          company: vehicle.company,
          vehicle: vehicle._id,
          message: `موعد الصيانة القادم للمركبة ${vehicle.plateNumber} خلال 7 أيام`,
          metadata: {
            nextMaintenanceDate: vehicle.nextMaintenanceDate
          }
        });
      }
    } catch (error) {
      logger.error('Failed to check maintenance alerts:', {
        error: error.message
      });
      throw error;
    }
  }
}

module.exports = new MaintenanceService();