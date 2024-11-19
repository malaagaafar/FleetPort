const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const Driver = require('../models/Driver');
const moment = require('moment');

class AdvancedAnalyticsService {
  async generateFleetEfficiencyReport(companyId, dateRange) {
    try {
      const { startDate, endDate } = dateRange;
      
      const trips = await Trip.find({
        company: companyId,
        startTime: { $gte: startDate },
        endTime: { $lte: endDate }
      }).populate('vehicle driver');

      const vehicles = await Vehicle.find({ company: companyId });

      return {
        fleetUtilization: this.calculateFleetUtilization(vehicles, trips),
        fuelEfficiency: this.calculateFuelEfficiency(trips),
        maintenanceMetrics: await this.analyzeMaintenanceMetrics(vehicles),
        driverPerformance: await this.analyzeDriverPerformance(trips),
        costAnalysis: this.analyzeCosts(trips)
      };
    } catch (error) {
      throw new Error('Failed to generate fleet efficiency report');
    }
  }

  calculateFleetUtilization(vehicles, trips) {
    const totalVehicles = vehicles.length;
    const activeVehicles = new Set(trips.map(trip => trip.vehicle.id)).size;
    
    return {
      utilizationRate: (activeVehicles / totalVehicles) * 100,
      idleTime: this.calculateIdleTime(vehicles, trips),
      activeHours: this.calculateActiveHours(trips)
    };
  }

  calculateFuelEfficiency(trips) {
    const efficiency = trips.reduce((acc, trip) => {
      if (trip.distance && trip.fuelConsumption) {
        acc.totalDistance += trip.distance;
        acc.totalFuel += trip.fuelConsumption;
      }
      return acc;
    }, { totalDistance: 0, totalFuel: 0 });

    return {
      averageConsumption: efficiency.totalFuel > 0 ? 
        efficiency.totalDistance / efficiency.totalFuel : 0,
      trends: this.analyzeFuelTrends(trips)
    };
  }

  async analyzeMaintenanceMetrics(vehicles) {
    // تحليل بيانات الصيانة وتوقع الاحتياجات المستقبلية
    return {
      maintenanceCosts: await this.calculateMaintenanceCosts(vehicles),
      predictedMaintenance: await this.predictMaintenanceNeeds(vehicles),
      vehicleHealth: await this.assessVehicleHealth(vehicles)
    };
  }

  async analyzeDriverPerformance(trips) {
    const driverStats = {};
    
    trips.forEach(trip => {
      const driverId = trip.driver.id;
      if (!driverStats[driverId]) {
        driverStats[driverId] = {
          totalTrips: 0,
          totalDistance: 0,
          fuelEfficiency: 0,
          safetyScore: 0
        };
      }
      
      // تحديث إحصائيات السائق
      const stats = driverStats[driverId];
      stats.totalTrips++;
      stats.totalDistance += trip.distance || 0;
      stats.fuelEfficiency += trip.fuelConsumption ? 
        (trip.distance / trip.fuelConsumption) : 0;
      stats.safetyScore += this.calculateTripSafetyScore(trip);
    });

    return Object.entries(driverStats).map(([driverId, stats]) => ({
      driverId,
      metrics: {
        ...stats,
        averageFuelEfficiency: stats.fuelEfficiency / stats.totalTrips,
        averageSafetyScore: stats.safetyScore / stats.totalTrips
      }
    }));
  }

  calculateTripSafetyScore(trip) {
    // حساب درجة السلامة بناءً على عوامل مختلفة
    let score = 100;
    
    // خصم نقاط للسرعة الزائدة
    if (trip.maxSpeed > 120) {
      score -= (trip.maxSpeed - 120) * 0.5;
    }
    
    // خصم نقاط للفرملة المفاجئة
    score -= (trip.harshBraking || 0) * 5;
    
    // خصم نقاط للتسارع السريع
    score -= (trip.harshAcceleration || 0) * 5;
    
    return Math.max(0, Math.min(100, score));
  }
}

module.exports = new AdvancedAnalyticsService();