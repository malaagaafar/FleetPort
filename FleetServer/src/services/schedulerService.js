const schedule = require('node-schedule');
const MaintenanceService = require('./maintenanceService');
const NotificationService = require('./notificationService');
const AnalyticsService = require('./analyticsService');
const logger = require('../utils/logger');

class SchedulerService {
  constructor() {
    this.jobs = new Map();
    this.initializeScheduledJobs();
  }

  initializeScheduledJobs() {
    // فحص الصيانة اليومي
    this.scheduleJob('dailyMaintenanceCheck', '0 0 * * *', async () => {
      try {
        await MaintenanceService.checkMaintenanceAlerts();
      } catch (error) {
        logger.error('Daily maintenance check failed:', error);
      }
    });

    // تحديث التحليلات كل ساعة
    this.scheduleJob('hourlyAnalyticsUpdate', '0 * * * *', async () => {
      try {
        await AnalyticsService.updateHourlyMetrics();
      } catch (error) {
        logger.error('Hourly analytics update failed:', error);
      }
    });

    // تنظيف السجلات القديمة أسبوعياً
    this.scheduleJob('weeklyCleanup', '0 0 * * 0', async () => {
      try {
        await this.cleanupOldRecords();
      } catch (error) {
        logger.error('Weekly cleanup failed:', error);
      }
    });

    // إنشاء النسخ الاحتياطية يومياً
    this.scheduleJob('dailyBackup', '0 2 * * *', async () => {
      try {
        await this.performDatabaseBackup();
      } catch (error) {
        logger.error('Daily backup failed:', error);
      }
    });
  }

  scheduleJob(name, cronExpression, callback) {
    try {
      const job = schedule.scheduleJob(cronExpression, async () => {
        logger.info(`Starting scheduled job: ${name}`);
        try {
          await callback();
          logger.info(`Completed scheduled job: ${name}`);
        } catch (error) {
          logger.error(`Scheduled job failed: ${name}`, error);
        }
      });

      this.jobs.set(name, job);
      logger.info(`Scheduled job registered: ${name}`);
    } catch (error) {
      logger.error(`Failed to schedule job: ${name}`, error);
    }
  }

  cancelJob(name) {
    const job = this.jobs.get(name);
    if (job) {
      job.cancel();
      this.jobs.delete(name);
      logger.info(`Cancelled scheduled job: ${name}`);
    }
  }

  async cleanupOldRecords() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      // تنظيف سجلات الإشعارات القديمة
      await NotificationLog.deleteMany({
        createdAt: { $lt: thirtyDaysAgo }
      });

      // تنظيف سجلات الأحداث القديمة
      await EventLog.deleteMany({
        timestamp: { $lt: thirtyDaysAgo }
      });

      logger.info('Completed cleanup of old records');
    } catch (error) {
      throw new Error('Failed to cleanup old records: ' + error.message);
    }
  }

  async performDatabaseBackup() {
    // تنفيذ النسخ الاحتياطي لقاعدة البيانات
    // يمكن تنفيذ هذا باستخدام mongodump أو أي أداة نسخ احتياطي أخرى
  }
}

module.exports = new SchedulerService();