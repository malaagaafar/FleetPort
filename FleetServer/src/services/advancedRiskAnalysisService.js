const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const Event = require('../models/Event');
const WeatherService = require('./weatherService');
const MachineLearningService = require('./machineLearningService');
const logger = require('../utils/logger');

class AdvancedRiskAnalysisService {
  async analyzeComprehensiveRisk(companyId) {
    try {
      const [
        vehicles,
        drivers,
        trips,
        events
      ] = await Promise.all([
        Vehicle.find({ company: companyId }),
        Driver.find({ company: companyId }),
        this.getRecentTrips(companyId),
        this.getRecentEvents(companyId)
      ]);

      return {
        overallRiskAssessment: await this.assessOverallRisk(vehicles, drivers, trips, events),
        vehicleRisks: await this.analyzeVehicleRisks(vehicles, trips, events),
        driverRisks: await this.analyzeDriverRisks(drivers, trips, events),
        operationalRisks: await this.analyzeOperationalRisks(trips, events),
        environmentalRisks: await this.analyzeEnvironmentalRisks(trips),
        predictiveAnalysis: await this.performPredictiveAnalysis(vehicles, drivers, trips, events),
        recommendations: this.generateRiskMitigationRecommendations(vehicles, drivers, trips, events)
      };
    } catch (error) {
      logger.error('Comprehensive risk analysis failed:', {
        companyId,
        error: error.message
      });
      throw error;
    }
  }

  async getRecentTrips(companyId) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return Trip.find({
      company: companyId,
      startTime: { $gte: thirtyDaysAgo }
    }).populate('vehicle driver');
  }

  async getRecentEvents(companyId) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return Event.find({
      company: companyId,
      timestamp: { $gte: thirtyDaysAgo }
    });
  }

  async assessOverallRisk(vehicles, drivers, trips, events) {
    const vehicleRiskScore = await this.calculateVehicleRiskScore(vehicles, trips, events);
    const driverRiskScore = await this.calculateDriverRiskScore(drivers, trips, events);
    const operationalRiskScore = this.calculateOperationalRiskScore(trips, events);
    const environmentalRiskScore = await this.calculateEnvironmentalRiskScore(trips);

    const overallRiskScore = this.calculateWeightedRiskScore({
      vehicleRisk: vehicleRiskScore,
      driverRisk: driverRiskScore,
      operationalRisk: operationalRiskScore,
      environmentalRisk: environmentalRiskScore
    });

    return {
      score: overallRiskScore,
      level: this.determineRiskLevel(overallRiskScore),
      components: {
        vehicleRisk: vehicleRiskScore,
        driverRisk: driverRiskScore,
        operationalRisk: operationalRiskScore,
        environmentalRisk: environmentalRiskScore
      },
      trends: await this.analyzeRiskTrends(trips, events)
    };
  }

  async analyzeVehicleRisks(vehicles, trips, events) {
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
        riskScore: await this.calculateIndividualVehicleRisk(vehicle, vehicleTrips, vehicleEvents),
        maintenanceRisk: await this.assessMaintenanceRisk(vehicle),
        operationalRisk: this.assessVehicleOperationalRisk(vehicleTrips, vehicleEvents),
        historicalIncidents: this.analyzeHistoricalIncidents(vehicleEvents),
        predictedRisks: await this.predictVehicleRisks(vehicle, vehicleTrips, vehicleEvents)
      };
    }));
  }

  async analyzeDriverRisks(drivers, trips, events) {
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
        riskScore: await this.calculateIndividualDriverRisk(driver, driverTrips, driverEvents),
        behavioralRisk: this.assessDriverBehavior(driverEvents),
        fatigueRisk: await this.assessFatigueRisk(driver, driverTrips),
        complianceRisk: this.assessDriverCompliance(driver, driverTrips),
        predictedRisks: await this.predictDriverRisks(driver, driverTrips, driverEvents)
      };
    }));
  }

  async analyzeOperationalRisks(trips, events) {
    return {
      routeRisks: await this.analyzeRouteRisks(trips, events),
      timeRisks: this.analyzeTimeBasedRisks(trips),
      loadRisks: this.analyzeLoadRisks(trips),
      processRisks: this.analyzeProcessRisks(trips, events),
      systemRisks: await this.analyzeSystemRisks()
    };
  }

  async analyzeEnvironmentalRisks(trips) {
    return {
      weatherRisks: await this.analyzeWeatherRisks(trips),
      roadConditionRisks: await this.analyzeRoadConditionRisks(trips),
      trafficRisks: await this.analyzeTrafficRisks(trips),
      seasonalRisks: this.analyzeSeasonalRisks(trips)
    };
  }

  async performPredictiveAnalysis(vehicles, drivers, trips, events) {
    return {
      shortTerm: await this.predictShortTermRisks(vehicles, drivers, trips, events),
      mediumTerm: await this.predictMediumTermRisks(vehicles, drivers, trips, events),
      longTerm: await this.predictLongTermRisks(vehicles, drivers, trips, events),
      emergingRisks: await this.identifyEmergingRisks(vehicles, drivers, trips, events)
    };
  }

  generateRiskMitigationRecommendations(vehicles, drivers, trips, events) {
    const recommendations = [];

    // تحليل المخاطر العالية وإضافة التوصيات
    const highRisks = this.identifyHighRiskAreas(vehicles, drivers, trips, events);
    
    highRisks.forEach(risk => {
      recommendations.push({
        area: risk.area,
        riskLevel: risk.level,
        priority: risk.priority,
        mitigation: this.generateMitigationStrategies(risk),
        timeline: this.suggestImplementationTimeline(risk),
        resources: this.identifyRequiredResources(risk)
      });
    });

    return recommendations;
  }

  // ... المزيد من الوظائف المساعدة ...
}

module.exports = new AdvancedRiskAnalysisService();