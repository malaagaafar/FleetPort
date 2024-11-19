const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const Event = require('../models/Event');
const SensorData = require('../models/SensorData');
const logger = require('../utils/logger');

class DriverBehaviorService {
  async analyzeBehavior(driverId, dateRange) {
    try {
      const [driver, trips, events, sensorData] = await Promise.all([
        Driver.findById(driverId),
        this.getDriverTrips(driverId, dateRange),
        this.getDriverEvents(driverId, dateRange),
        this.getDriverSensorData(driverId, dateRange)
      ]);

      if (!driver) {
        throw new Error('السائق غير موجود');
      }

      return {
        driverId,
        period: dateRange,
        behaviorScore: this.calculateBehaviorScore(trips, events, sensorData),
        drivingPatterns: this.analyzeDrivingPatterns(trips, events, sensorData),
        safetyMetrics: this.analyzeSafetyMetrics(events, sensorData),
        efficiencyMetrics: this.analyzeEfficiencyMetrics(trips, sensorData),
        complianceMetrics: this.analyzeComplianceMetrics(driver, trips, events),
        recommendations: this.generateBehaviorRecommendations(trips, events, sensorData)
      };
    } catch (error) {
      logger.error('Driver behavior analysis failed:', {
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

  async getDriverSensorData(driverId, dateRange) {
    return SensorData.find({
      driver: driverId,
      timestamp: { $gte: dateRange.start, $lte: dateRange.end }
    });
  }

  calculateBehaviorScore(trips, events, sensorData) {
    const weights = {
      safety: 0.4,
      efficiency: 0.3,
      compliance: 0.3
    };

    const safetyScore = this.calculateSafetyScore(events, sensorData);
    const efficiencyScore = this.calculateEfficiencyScore(trips, sensorData);
    const complianceScore = this.calculateComplianceScore(trips, events);

    return {
      overall: (
        safetyScore * weights.safety +
        efficiencyScore * weights.efficiency +
        complianceScore * weights.compliance
      ),
      components: {
        safety: safetyScore,
        efficiency: efficiencyScore,
        compliance: complianceScore
      }
    };
  }

  analyzeDrivingPatterns(trips, events, sensorData) {
    return {
      acceleration: this.analyzeAccelerationPatterns(sensorData),
      braking: this.analyzeBrakingPatterns(sensorData),
      cornering: this.analyzeCorneringBehavior(sensorData),
      speedControl: this.analyzeSpeedControl(trips, events, sensorData),
      idling: this.analyzeIdlingBehavior(trips, sensorData)
    };
  }

  analyzeSafetyMetrics(events, sensorData) {
    return {
      harshEvents: this.analyzeHarshEvents(events),
      speedingIncidents: this.analyzeSpeedingIncidents(events),
      followingDistance: this.analyzeFollowingDistance(sensorData),
      distractions: this.analyzeDriverDistractions(events),
      safetyScore: this.calculateDetailedSafetyScore(events, sensorData)
    };
  }

  analyzeEfficiencyMetrics(trips, sensorData) {
    return {
      fuelEfficiency: this.analyzeFuelEfficiency(trips, sensorData),
      routeAdherence: this.analyzeRouteAdherence(trips),
      idleTime: this.calculateIdleTime(trips, sensorData),
      speedOptimization: this.analyzeSpeedOptimization(trips, sensorData),
      efficiencyScore: this.calculateDetailedEfficiencyScore(trips, sensorData)
    };
  }

  analyzeComplianceMetrics(driver, trips, events) {
    return {
      restPeriods: this.analyzeRestPeriods(trips),
      workingHours: this.analyzeWorkingHours(trips),
      speedLimitCompliance: this.analyzeSpeedLimitCompliance(events),
      documentationStatus: this.checkDocumentationStatus(driver),
      complianceScore: this.calculateDetailedComplianceScore(driver, trips, events)
    };
  }

  generateBehaviorRecommendations(trips, events, sensorData) {
    const recommendations = [];

    // تحليل أنماط القيادة وإضافة التوصيات
    const drivingPatterns = this.analyzeDrivingPatterns(trips, events, sensorData);
    if (drivingPatterns.acceleration.score < 0.7) {
      recommendations.push({
        area: 'acceleration',
        priority: 'high',
        recommendation: 'تحسين أنماط التسارع',
        actions: [
          'تجنب التسارع المفاجئ',
          'الحفاظ على تسارع تدريجي',
          'مراقبة استهلاك الوقود أثناء التسارع'
        ]
      });
    }

    // تحليل السلامة وإضافة التوصيات
    const safetyMetrics = this.analyzeSafetyMetrics(events, sensorData);
    if (safetyMetrics.harshEvents.frequency > 0.1) {
      recommendations.push({
        area: 'safety',
        priority: 'high',
        recommendation: 'تحسين السلامة في القيادة',
        actions: [
          'تجنب الفرملة المفاجئة',
          'الحفاظ على مسافة آمنة',
          'توقع حركة المرور'
        ]
      });
    }

    return recommendations;
  }

  // ... المزيد من الوظائف المساعدة ...
}

module.exports = new DriverBehaviorService();