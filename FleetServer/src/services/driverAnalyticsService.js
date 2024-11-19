const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const Event = require('../models/Event');
const logger = require('../utils/logger');

class DriverAnalyticsService {
  async generateDriverReport(driverId, dateRange) {
    try {
      const driver = await Driver.findById(driverId);
      if (!driver) {
        throw new Error('السائق غير موجود');
      }

      const [trips, events] = await Promise.all([
        this.getDriverTrips(driverId, dateRange),
        this.getDriverEvents(driverId, dateRange)
      ]);

      return {
        driverInfo: this.getDriverInfo(driver),
        performance: await this.analyzePerformance(trips, events),
        safety: this.analyzeSafetyMetrics(trips, events),
        efficiency: this.analyzeEfficiency(trips),
        compliance: await this.analyzeCompliance(driver, trips),
        recommendations: await this.generateRecommendations(driver, trips, events)
      };
    } catch (error) {
      logger.error('Failed to generate driver report:', {
        driverId,
        error: error.message
      });
      throw error;
    }
  }

  async getDriverTrips(driverId, dateRange) {
    return Trip.find({
      driver: driverId,
      startTime: { $gte: dateRange.start, $lte: dateRange.end }
    }).populate('vehicle');
  }

  async getDriverEvents(driverId, dateRange) {
    return Event.find({
      driver: driverId,
      timestamp: { $gte: dateRange.start, $lte: dateRange.end }
    });
  }

  getDriverInfo(driver) {
    return {
      name: `${driver.firstName} ${driver.lastName}`,
      licenseNumber: driver.licenseNumber,
      experience: this.calculateExperience(driver.joinDate),
      certifications: driver.certifications,
      status: driver.status
    };
  }

  async analyzePerformance(trips, events) {
    const totalTrips = trips.length;
    const completedTrips = trips.filter(trip => trip.status === 'completed').length;
    const onTimeDeliveries = trips.filter(trip => !trip.isDelayed).length;

    const performanceScore = this.calculatePerformanceScore({
      completionRate: completedTrips / totalTrips,
      onTimeRate: onTimeDeliveries / totalTrips,
      eventSeverity: this.calculateEventSeverity(events)
    });

    return {
      totalTrips,
      completedTrips,
      onTimeDeliveries,
      performanceScore,
      trends: await this.analyzePerformanceTrends(trips),
      ratings: await this.analyzeCustomerRatings(trips)
    };
  }

  analyzeSafetyMetrics(trips, events) {
    const safetyEvents = events.filter(event => 
      ['harsh_braking', 'rapid_acceleration', 'speeding'].includes(event.type)
    );

    const speedingInstances = events.filter(event => event.type === 'speeding').length;
    const harshBraking = events.filter(event => event.type === 'harsh_braking').length;
    const rapidAcceleration = events.filter(event => event.type === 'rapid_acceleration').length;

    const safetyScore = this.calculateSafetyScore({
      speedingInstances,
      harshBraking,
      rapidAcceleration,
      totalTrips: trips.length
    });

    return {
      safetyScore,
      safetyEvents: {
        total: safetyEvents.length,
        speeding: speedingInstances,
        harshBraking,
        rapidAcceleration
      },
      riskLevel: this.calculateRiskLevel(safetyScore),
      safetyTrends: this.analyzeSafetyTrends(events)
    };
  }

  analyzeEfficiency(trips) {
    const fuelEfficiency = this.calculateAverageFuelEfficiency(trips);
    const routeOptimization = this.analyzeRouteOptimization(trips);
    const idleTime = this.calculateTotalIdleTime(trips);

    return {
      fuelEfficiency,
      routeOptimization,
      idleTime,
      costPerKm: this.calculateCostPerKilometer(trips),
      timeManagement: this.analyzeTimeManagement(trips)
    };
  }

  async analyzeCompliance(driver, trips) {
    const licenseStatus = await this.checkLicenseStatus(driver);
    const restPeriods = this.analyzeRestPeriods(trips);
    const workingHours = this.calculateWorkingHours(trips);

    return {
      licenseStatus,
      restPeriods,
      workingHours,
      violations: await this.checkComplianceViolations(driver, trips),
      trainingStatus: await this.checkTrainingCompliance(driver)
    };
  }

  async generateRecommendations(driver, trips, events) {
    const recommendations = [];

    // تحليل الأداء وإضافة التوصيات
    const performanceIssues = this.identifyPerformanceIssues(trips, events);
    const safetyIssues = this.identifySafetyIssues(events);
    const efficiencyIssues = this.identifyEfficiencyIssues(trips);

    // إضافة توصيات بناءً على المشكلات المحددة
    if (performanceIssues.length > 0) {
      recommendations.push(...this.getPerformanceRecommendations(performanceIssues));
    }

    if (safetyIssues.length > 0) {
      recommendations.push(...this.getSafetyRecommendations(safetyIssues));
    }

    if (efficiencyIssues.length > 0) {
      recommendations.push(...this.getEfficiencyRecommendations(efficiencyIssues));
    }

    // التحقق من الحاجة للتدريب
    const trainingNeeds = await this.assessTrainingNeeds(driver, trips, events);
    if (trainingNeeds.length > 0) {
      recommendations.push({
        type: 'training',
        priority: 'high',
        suggestions: trainingNeeds
      });
    }

    return recommendations;
  }

  calculatePerformanceScore(metrics) {
    const weights = {
      completionRate: 0.4,
      onTimeRate: 0.4,
      eventSeverity: 0.2
    };

    return (
      metrics.completionRate * weights.completionRate +
      metrics.onTimeRate * weights.onTimeRate +
      (1 - metrics.eventSeverity) * weights.eventSeverity
    ) * 100;
  }

  calculateSafetyScore(metrics) {
    const baseScore = 100;
    const deductions = {
      speeding: 5,
      harshBraking: 3,
      rapidAcceleration: 2
    };

    const totalDeductions = 
      (metrics.speedingInstances * deductions.speeding) +
      (metrics.harshBraking * deductions.harshBraking) +
      (metrics.rapidAcceleration * deductions.rapidAcceleration);

    return Math.max(0, baseScore - totalDeductions);
  }

  // ... المزيد من الوظائف المساعدة ...
}

module.exports = new DriverAnalyticsService();