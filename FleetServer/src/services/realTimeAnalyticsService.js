const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const Driver = require('../models/Driver');
const redis = require('../config/redis');
const socketHandler = require('../websocket/socketHandler');
const logger = require('../utils/logger');

class RealTimeAnalyticsService {
  constructor() {
    this.updateInterval = 5000; // 5 ثواني
    this.activeAnalytics = new Map();
  }

  async startTracking(companyId) {
    if (this.activeAnalytics.has(companyId)) {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        const analytics = await this.generateRealTimeAnalytics(companyId);
        await this.broadcastAnalytics(companyId, analytics);
      } catch (error) {
        logger.error('Real-time analytics update failed:', {
          companyId,
          error: error.message
        });
      }
    }, this.updateInterval);

    this.activeAnalytics.set(companyId, intervalId);
  }

  stopTracking(companyId) {
    const intervalId = this.activeAnalytics.get(companyId);
    if (intervalId) {
      clearInterval(intervalId);
      this.activeAnalytics.delete(companyId);
    }
  }

  async generateRealTimeAnalytics(companyId) {
    try {
      const [
        activeVehicles,
        activeTrips,
        activeDrivers
      ] = await Promise.all([
        this.getActiveVehicles(companyId),
        this.getActiveTrips(companyId),
        this.getActiveDrivers(companyId)
      ]);

      const analytics = {
        timestamp: new Date(),
        fleetStatus: this.analyzeFleetStatus(activeVehicles),
        tripMetrics: this.analyzeTripMetrics(activeTrips),
        driverMetrics: this.analyzeDriverMetrics(activeDrivers),
        alerts: await this.getActiveAlerts(companyId)
      };

      // تخزين التحليلات في Redis للوصول السريع
      await this.cacheAnalytics(companyId, analytics);

      return analytics;
    } catch (error) {
      logger.error('Failed to generate real-time analytics:', {
        companyId,
        error: error.message
      });
      throw error;
    }
  }

  async getActiveVehicles(companyId) {
    return await Vehicle.find({
      company: companyId,
      status: 'active',
      lastUpdate: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // آخر 5 دقائق
    }).select('plateNumber location status speed fuel');
  }

  async getActiveTrips(companyId) {
    return await Trip.find({
      company: companyId,
      status: 'in_progress'
    }).populate('vehicle driver');
  }

  async getActiveDrivers(companyId) {
    return await Driver.find({
      company: companyId,
      status: 'active',
      currentTrip: { $exists: true }
    });
  }

  analyzeFleetStatus(vehicles) {
    const status = {
      total: vehicles.length,
      moving: 0,
      idle: 0,
      stopped: 0,
      averageSpeed: 0,
      totalFuel: 0
    };

    vehicles.forEach(vehicle => {
      if (vehicle.speed > 5) {
        status.moving++;
      } else if (vehicle.speed > 0) {
        status.idle++;
      } else {
        status.stopped++;
      }

      status.averageSpeed += vehicle.speed;
      status.totalFuel += vehicle.fuel;
    });

    status.averageSpeed = vehicles.length ? 
      status.averageSpeed / vehicles.length : 0;

    return status;
  }

  analyzeTripMetrics(trips) {
    return {
      activeTrips: trips.length,
      onTimeDeliveries: trips.filter(t => !t.isDelayed).length,
      delayedTrips: trips.filter(t => t.isDelayed).length,
      averageDelay: this.calculateAverageDelay(trips),
      tripProgress: this.calculateTripProgress(trips)
    };
  }

  analyzeDriverMetrics(drivers) {
    return {
      activeDrivers: drivers.length,
      averageSpeed: this.calculateAverageDriverSpeed(drivers),
      safetyScores: this.calculateDriverSafetyScores(drivers),
      workloadDistribution: this.analyzeWorkloadDistribution(drivers)
    };
  }

  async getActiveAlerts(companyId) {
    const cacheKey = `alerts:${companyId}`;
    const cachedAlerts = await redis.get(cacheKey);

    if (cachedAlerts) {
      return JSON.parse(cachedAlerts);
    }

    // جلب التنبيهات النشطة من قاعدة البيانات
    const alerts = await Alert.find({
      company: companyId,
      status: 'active',
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }).sort('-severity');

    await redis.setex(cacheKey, 60, JSON.stringify(alerts)); // تخزين مؤقت لمدة دقيقة
    return alerts;
  }

  async cacheAnalytics(companyId, analytics) {
    const cacheKey = `analytics:${companyId}`;
    await redis.setex(cacheKey, 60, JSON.stringify(analytics));
  }

  async broadcastAnalytics(companyId, analytics) {
    socketHandler.broadcastToCompany(companyId, 'analytics_update', analytics);
  }

  calculateAverageDelay(trips) {
    if (!trips.length) return 0;
    const totalDelay = trips.reduce((sum, trip) => {
      return sum + (trip.delay || 0);
    }, 0);
    return totalDelay / trips.length;
  }

  calculateTripProgress(trips) {
    return trips.map(trip => ({
      tripId: trip._id,
      progress: this.calculateSingleTripProgress(trip),
      estimatedTimeRemaining: this.estimateTimeRemaining(trip)
    }));
  }

  calculateSingleTripProgress(trip) {
    if (!trip.route || !trip.route.length) return 0;
    const completedWaypoints = trip.route.filter(wp => wp.completed).length;
    return (completedWaypoints / trip.route.length) * 100;
  }

  estimateTimeRemaining(trip) {
    // حساب الوقت المتبقي بناءً على السرعة الحالية والمسافة المتبقية
    // يمكن تحسين هذا باستخدام خوارزميات تنبؤ أكثر تعقيداً
  }
}

module.exports = new RealTimeAnalyticsService();