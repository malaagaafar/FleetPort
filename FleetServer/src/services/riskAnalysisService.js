const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const Event = require('../models/Event');
const Weather = require('../services/weatherService');
const logger = require('../utils/logger');

class RiskAnalysisService {
  async analyzeRisk(companyId) {
    try {
      const [vehicles, drivers, trips, events] = await Promise.all([
        this.getActiveVehicles(companyId),
        this.getActiveDrivers(companyId),
        this.getRecentTrips(companyId),
        this.getRecentEvents(companyId)
      ]);

      return {
        overallRiskScore: this.calculateOverallRiskScore({
          vehicles,
          drivers,
          trips,
          events
        }),
        vehicleRisks: await this.analyzeVehicleRisks(vehicles, trips, events),
        driverRisks: await this.analyzeDriverRisks(drivers, trips, events),
        routeRisks: await this.analyzeRouteRisks(trips, events),
        weatherRisks: await this.analyzeWeatherRisks(trips),
        recommendations: this.generateRiskRecommendations({
          vehicles,
          drivers,
          trips,
          events
        })
      };
    } catch (error) {
      logger.error('Risk analysis failed:', {
        companyId,
        error: error.message
      });
      throw error;
    }
  }

  async getActiveVehicles(companyId) {
    return Vehicle.find({
      company: companyId,
      status: 'active'
    });
  }

  async getActiveDrivers(companyId) {
    return Driver.find({
      company: companyId,
      status: 'active'
    });
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

  calculateOverallRiskScore(data) {
    const weights = {
      vehicleRisk: 0.3,
      driverRisk: 0.3,
      routeRisk: 0.2,
      weatherRisk: 0.1,
      historicalRisk: 0.1
    };

    const vehicleRiskScore = this.calculateAverageVehicleRisk(data.vehicles, data.trips);
    const driverRiskScore = this.calculateAverageDriverRisk(data.drivers, data.trips);
    const routeRiskScore = this.calculateRouteRisk(data.trips);
    const weatherRiskScore = this.calculateWeatherRisk(data.trips);
    const historicalRiskScore = this.calculateHistoricalRisk(data.events);

    return (
      vehicleRiskScore * weights.vehicleRisk +
      driverRiskScore * weights.driverRisk +
      routeRiskScore * weights.routeRisk +
      weatherRiskScore * weights.weatherRisk +
      historicalRiskScore * weights.historicalRisk
    );
  }

  async analyzeVehicleRisks(vehicles, trips, events) {
    return Promise.all(vehicles.map(async vehicle => {
      const vehicleTrips = trips.filter(trip => 
        trip.vehicle._id.toString() === vehicle._id.toString()
      );
      const vehicleEvents = events.filter(event => 
        event.vehicle && event.vehicle.toString() === vehicle._id.toString()
      );

      return {
        vehicleId: vehicle._id,
        plateNumber: vehicle.plateNumber,
        riskScore: this.calculateVehicleRiskScore(vehicle, vehicleTrips, vehicleEvents),
        maintenanceRisk: await this.assessMaintenanceRisk(vehicle),
        ageRisk: this.calculateVehicleAgeRisk(vehicle),
        performanceRisk: this.analyzeVehiclePerformance(vehicleTrips, vehicleEvents),
        recommendations: this.getVehicleRiskRecommendations(vehicle, vehicleTrips, vehicleEvents)
      };
    }));
  }

  async analyzeDriverRisks(drivers, trips, events) {
    return Promise.all(drivers.map(async driver => {
      const driverTrips = trips.filter(trip => 
        trip.driver._id.toString() === driver._id.toString()
      );
      const driverEvents = events.filter(event => 
        event.driver && event.driver.toString() === driver._id.toString()
      );

      return {
        driverId: driver._id,
        name: `${driver.firstName} ${driver.lastName}`,
        riskScore: this.calculateDriverRiskScore(driver, driverTrips, driverEvents),
        fatigueRisk: await this.assessFatigueRisk(driver, driverTrips),
        behaviorRisk: this.analyzeDriverBehavior(driverEvents),
        experienceRisk: this.calculateExperienceRisk(driver),
        recommendations: this.getDriverRiskRecommendations(driver, driverTrips, driverEvents)
      };
    }));
  }

  async analyzeRouteRisks(trips, events) {
    const routeAnalysis = new Map();

    for (const trip of trips) {
      const routeKey = this.generateRouteKey(trip.startLocation, trip.endLocation);
      const routeEvents = events.filter(event => 
        event.tripId && event.tripId.toString() === trip._id.toString()
      );

      if (!routeAnalysis.has(routeKey)) {
        routeAnalysis.set(routeKey, {
          startLocation: trip.startLocation,
          endLocation: trip.endLocation,
          trips: [],
          events: [],
          riskFactors: new Set()
        });
      }

      const routeData = routeAnalysis.get(routeKey);
      routeData.trips.push(trip);
      routeData.events.push(...routeEvents);
    }

    return Array.from(routeAnalysis.values()).map(routeData => ({
      route: {
        start: routeData.startLocation,
        end: routeData.endLocation
      },
      riskScore: this.calculateRouteRiskScore(routeData),
      trafficRisk: this.analyzeTrafficRisk(routeData),
      accidentHistory: this.analyzeAccidentHistory(routeData),
      weatherRisk: this.analyzeRouteWeatherRisk(routeData),
      recommendations: this.getRouteRiskRecommendations(routeData)
    }));
  }

  // ... المزيد من الوظائف المساعدة ...
}

module.exports = new RiskAnalysisService();