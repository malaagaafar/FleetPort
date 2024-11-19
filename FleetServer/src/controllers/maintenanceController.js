const MaintenanceService = require('../services/maintenanceService');
const Vehicle = require('../models/Vehicle');
const logger = require('../utils/logger');

class MaintenanceController {
  async scheduleMaintenanceCheck(req, res, next) {
    try {
      const { vehicleId, maintenanceType, scheduledDate } = req.body;
      
      // التحقق من ملكية المركبة
      const vehicle = await Vehicle.findOne({
        _id: vehicleId,
        company: req.user.company
      });
      
      if (!vehicle) {
        return res.status(404).json({ message: 'المركبة غير موجودة' });
      }

      const maintenanceRecord = await MaintenanceService.scheduleMaintenanceCheck(
        vehicleId,
        maintenanceType,
        new Date(scheduledDate)
      );

      res.status(201).json(maintenanceRecord);
    } catch (error) {
      next(error);
    }
  }

  async updateMaintenanceStatus(req, res, next) {
    try {
      const { recordId } = req.params;
      const { status, details } = req.body;

      const record = await MaintenanceService.updateMaintenanceStatus(
        recordId,
        status,
        details
      );

      res.json(record);
    } catch (error) {
      next(error);
    }
  }

  async getMaintenanceHistory(req, res, next) {
    try {
      const { vehicleId } = req.params;
      const filters = {
        status: req.query.status,
        dateRange: req.query.dateRange ? {
          start: new Date(req.query.dateRange.start),
          end: new Date(req.query.dateRange.end)
        } : null
      };

      // التحقق من ملكية المركبة
      const vehicle = await Vehicle.findOne({
        _id: vehicleId,
        company: req.user.company
      });
      
      if (!vehicle) {
        return res.status(404).json({ message: 'المركبة غير موجودة' });
      }

      const records = await MaintenanceService.getMaintenanceHistory(
        vehicleId,
        filters
      );

      res.json(records);
    } catch (error) {
      next(error);
    }
  }

  async getUpcomingMaintenance(req, res, next) {
    try {
      const vehicles = await Vehicle.find({
        company: req.user.company,
        nextMaintenanceDate: {
          $gte: new Date(),
          $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 يوم
        }
      }).select('plateNumber make model nextMaintenanceDate');

      res.json(vehicles);
    } catch (error) {
      next(error);
    }
  }

  async addMaintenanceAttachment(req, res, next) {
    try {
      const { recordId } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: 'لم يتم تحميل أي ملف' });
      }

      const record = await MaintenanceService.addAttachment(recordId, {
        type: file.mimetype,
        url: file.path,
        name: file.originalname,
        uploadedAt: new Date()
      });

      res.json(record);
    } catch (error) {
      next(error);
    }
  }

  async getMaintenanceStats(req, res, next) {
    try {
      const stats = await MaintenanceService.getMaintenanceStats(req.user.company);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  async generateMaintenanceReport(req, res, next) {
    try {
      const { startDate, endDate, format } = req.query;
      
      const report = await MaintenanceService.generateReport(
        req.user.company,
        {
          startDate: new Date(startDate),
          endDate: new Date(endDate)
        },
        format || 'pdf'
      );

      if (format === 'json') {
        return res.json(report);
      }

      // إرسال الملف للتحميل
      res.setHeader('Content-Type', format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=maintenance-report.${format}`);
      res.send(report);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MaintenanceController();