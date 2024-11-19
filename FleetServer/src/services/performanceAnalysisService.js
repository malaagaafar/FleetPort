const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const Event = require('../models/Event');
const logger = require('../utils/logger');

class PerformanceAnalysisService {
  async analyzeFleetPerformance(companyId, dateRange) {
    try {
      const [
        vehicles,
        drivers,
        trips,
        events
      ] = await Promise.all([
        Vehicle.find({ company: companyId }),
        Driver.find({ company: companyId }),
        this.getTrips(companyId, dateRange),
        this.getEvents(companyId, dateRange)
      ]);

      return {
        overview: this.generatePerformanceOverview(vehicles, drivers, trips, events),
        vehiclePerformance: await this.analyzeVehiclePerformance(vehicles, trips, events),
        driverPerformance: await this.analyzeDriverPerformance(drivers, trips, events),
        operationalEfficiency: this.analyzeOperationalEfficiency(trips, events),
        trends: this.analyzePerformanceTrends(trips, events),
        recommendations: this.generatePerformanceRecommendations(vehicles, drivers, trips, events)
      };
    } catch (error) {
      logger.error('Fleet performance analysis failed:', {
        companyId,
        error: error.message
      });
      throw error;
    }
  }

  async getTrips(companyId, dateRange) {
    return Trip.find({
      company: companyId,
      startTime: { $gte: dateRange.start, $lte: dateRange.end }
    }).populate('vehicle driver');
  }

  async getEvents(companyId, dateRange) {
    return Event.find({
      company: companyId,
      timestamp: { $gte: dateRange.start, $lte: dateRange.end }
    });
  }

  generatePerformanceOverview(vehicles, drivers, trips, events) {
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter(v => v.status === 'active').length;
    const totalDrivers = drivers.length;
    const activeDrivers = drivers.filter(d => d.status === 'active').length;

    return {
      fleetUtilization: {
        total: totalVehicles,
        active: activeVehicles,
        utilizationRate: (activeVehicles / totalVehicles) * 100
      },
      driverUtilization: {
        total: totalDrivers,
        active: activeDrivers,
        utilizationRate: (activeDrivers / totalDrivers) * 100
      },
      operationalMetrics: this.calculateOperationalMetrics(trips),
      safetyMetrics: this.calculateSafetyMetrics(events),
      efficiencyMetrics: this.calculateEfficiencyMetrics(trips, events)
    };
  }

  async analyzeVehiclePerformance(vehicles, trips, events) {
    return Promise.all(vehicles.map(async vehicle => {
      const vehicleTrips = trips.filter(t => 
        t.vehicle._id.toString() === vehicle._id.toString()
      );
      const vehicleEvents = events.filter(e => 
        e.vehicle && e.vehicle.toString() === vehicle._id.toString()
      );

      return {
        vehicleId: vehicle._id,
        plateNumber: vehicle.plateNumber,
        performanceScore: this.calculateVehiclePerformanceScore(vehicle, vehicleTrips, vehicleEvents),
        utilization: this.analyzeVehicleUtilization(vehicleTrips),
        maintenance: await this.analyzeVehicleMaintenance(vehicle),
        efficiency: this.analyzeVehicleEfficiency(vehicleTrips, vehicleEvents),
        reliability: this.calculateVehicleReliability(vehicleTrips, vehicleEvents)
      };
    }));
  }

  async analyzeDriverPerformance(drivers, trips, events) {
    return Promise.all(drivers.map(async driver => {
      const driverTrips = trips.filter(t => 
        t.driver._id.toString() === driver._id.toString()
      );
      const driverEvents = events.filter(e => 
        e.driver && e.driver.toString() === driver._id.toString()
      );

      return {
        driverId: driver._id,
        name: `${driver.firstName} ${driver.lastName}`,
        performanceScore: this.calculateDriverPerformanceScore(driver, driverTrips, driverEvents),
        safetyScore: this.calculateDriverSafetyScore(driverEvents),
        efficiency: this.analyzeDriverEfficiency(driverTrips),
        compliance: await this.analyzeDriverCompliance(driver, driverTrips),
        customerRating: await this.analyzeCustomerRatings(driverTrips)
      };
    }));
  }

  analyzeOperationalEfficiency(trips, events) {
    return {
      routeOptimization: this.analyzeRouteOptimization(trips),
      timeManagement: this.analyzeTimeManagement(trips),
      loadOptimization: this.analyzeLoadOptimization(trips),
      fuelEfficiency: this.analyzeFuelEfficiency(trips),
      costEfficiency: this.analyzeCostEfficiency(trips, events)
    };
  }

  analyzePerformanceTrends(trips, events) {
    return {
      daily: this.analyzeDailyTrends(trips, events),
      weekly: this.analyzeWeeklyTrends(trips, events),
      monthly: this.analyzeMonthlyTrends(trips, events),
      seasonal: this.analyzeSeasonalTrends(trips, events)
    };
  }

  generatePerformanceRecommendations(vehicles, drivers, trips, events) {
    const recommendations = [];

    // تحليل أداء الأسطول
    const fleetPerformance = this.analyzeFleetPerformanceMetrics(vehicles, trips);
    if (fleetPerformance.utilizationRate < 0.7) {
      recommendations.push({
        area: 'fleet',
        priority: 'high',
        recommendation: 'تحسين معدل استخدام الأسطول',
        impact: 'عالي',
        actions: [
          'تحسين جدولة المركبات',
          'مراجعة حجم الأسطول',
          'تحسين تخطيط المسارات'
        ]
      });
    }

    // تحليل أداء السائقين
    const driverPerformance = this.analyzeDriverPerformanceMetrics(drivers, trips);
    if (driverPerformance.averageScore < 0.75) {
      recommendations.push({
        area: 'drivers',
        priority: 'high',
        recommendation: 'تحسين أداء السائقين',
        impact: 'عالي',
        actions: [
          'تكثيف برامج التدريب',
          'تحسين نظام الحوافز',
          'تطوير برامج التوجيه'
        ]
      });
    }

    return recommendations;
  }

  calculateOperationalMetrics(trips) {
    const totalTrips = trips.length;
    const completedTrips = trips.filter(t => t.status === 'completed').length;
    const onTimeDeliveries = trips.filter(t => !t.isDelayed).length;

    return {
      tripCompletion: (completedTrips / totalTrips) * 100,
      onTimeDelivery: (onTimeDeliveries / totalTrips) * 100,
      averageTripDuration: this.calculateAverageTripDuration(trips),
      averageDistance: this.calculateAverageDistance(trips)
    };
  }

  // ... المزيد من الوظائف المساعدة ...
}

module.exports = new PerformanceAnalysisService();