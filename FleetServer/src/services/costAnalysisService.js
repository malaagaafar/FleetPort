const Trip = require('../models/Trip');
const MaintenanceRecord = require('../models/MaintenanceRecord');
const FuelRecord = require('../models/FuelRecord');
const Vehicle = require('../models/Vehicle');
const logger = require('../utils/logger');

class CostAnalysisService {
  async analyzeCosts(companyId, dateRange) {
    try {
      const [
        trips,
        maintenanceRecords,
        fuelRecords,
        vehicles
      ] = await Promise.all([
        this.getTrips(companyId, dateRange),
        this.getMaintenanceRecords(companyId, dateRange),
        this.getFuelRecords(companyId, dateRange),
        Vehicle.find({ company: companyId })
      ]);

      return {
        summary: this.generateCostSummary(trips, maintenanceRecords, fuelRecords),
        operationalCosts: this.analyzeOperationalCosts(trips, fuelRecords),
        maintenanceCosts: this.analyzeMaintenanceCosts(maintenanceRecords),
        vehicleCosts: this.analyzeVehicleCosts(vehicles, trips, maintenanceRecords, fuelRecords),
        trends: this.analyzeCostTrends(trips, maintenanceRecords, fuelRecords),
        optimization: this.generateOptimizationRecommendations(trips, maintenanceRecords, fuelRecords)
      };
    } catch (error) {
      logger.error('Cost analysis failed:', {
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

  async getMaintenanceRecords(companyId, dateRange) {
    return MaintenanceRecord.find({
      company: companyId,
      completedDate: { $gte: dateRange.start, $lte: dateRange.end }
    });
  }

  async getFuelRecords(companyId, dateRange) {
    return FuelRecord.find({
      company: companyId,
      date: { $gte: dateRange.start, $lte: dateRange.end }
    });
  }

  generateCostSummary(trips, maintenanceRecords, fuelRecords) {
    const totalOperationalCost = this.calculateTotalOperationalCost(trips, fuelRecords);
    const totalMaintenanceCost = this.calculateTotalMaintenanceCost(maintenanceRecords);
    const totalCost = totalOperationalCost + totalMaintenanceCost;

    return {
      totalCost,
      breakdown: {
        operational: {
          amount: totalOperationalCost,
          percentage: (totalOperationalCost / totalCost) * 100
        },
        maintenance: {
          amount: totalMaintenanceCost,
          percentage: (totalMaintenanceCost / totalCost) * 100
        }
      },
      costPerKilometer: this.calculateCostPerKilometer(totalCost, trips),
      costTrends: this.calculateCostTrends(trips, maintenanceRecords, fuelRecords)
    };
  }

  analyzeOperationalCosts(trips, fuelRecords) {
    return {
      fuel: this.analyzeFuelCosts(fuelRecords),
      labor: this.analyzeLaborCosts(trips),
      tolls: this.analyzeTollCosts(trips),
      other: this.analyzeOtherOperationalCosts(trips),
      efficiency: this.analyzeOperationalEfficiency(trips, fuelRecords)
    };
  }

  analyzeMaintenanceCosts(maintenanceRecords) {
    return {
      scheduled: this.analyzeScheduledMaintenance(maintenanceRecords),
      unscheduled: this.analyzeUnscheduledMaintenance(maintenanceRecords),
      parts: this.analyzePartsCosts(maintenanceRecords),
      labor: this.analyzeMaintenanceLaborCosts(maintenanceRecords),
      trends: this.analyzeMaintenanceTrends(maintenanceRecords)
    };
  }

  analyzeVehicleCosts(vehicles, trips, maintenanceRecords, fuelRecords) {
    return vehicles.map(vehicle => {
      const vehicleTrips = trips.filter(t => t.vehicle._id.toString() === vehicle._id.toString());
      const vehicleMaintenance = maintenanceRecords.filter(m => m.vehicle.toString() === vehicle._id.toString());
      const vehicleFuel = fuelRecords.filter(f => f.vehicle.toString() === vehicle._id.toString());

      return {
        vehicleId: vehicle._id,
        plateNumber: vehicle.plateNumber,
        totalCost: this.calculateVehicleTotalCost(vehicleTrips, vehicleMaintenance, vehicleFuel),
        costBreakdown: this.getVehicleCostBreakdown(vehicleTrips, vehicleMaintenance, vehicleFuel),
        costPerKilometer: this.calculateVehicleCostPerKilometer(vehicleTrips, vehicleMaintenance, vehicleFuel),
        efficiency: this.analyzeVehicleEfficiency(vehicle, vehicleTrips, vehicleMaintenance, vehicleFuel)
      };
    });
  }

  analyzeCostTrends(trips, maintenanceRecords, fuelRecords) {
    return {
      monthly: this.analyzeMonthlyTrends(trips, maintenanceRecords, fuelRecords),
      seasonal: this.analyzeSeasonalTrends(trips, maintenanceRecords, fuelRecords),
      yearly: this.analyzeYearlyTrends(trips, maintenanceRecords, fuelRecords),
      patterns: this.identifyCostPatterns(trips, maintenanceRecords, fuelRecords)
    };
  }

  generateOptimizationRecommendations(trips, maintenanceRecords, fuelRecords) {
    const recommendations = [];

    // تحليل استهلاك الوقود
    const fuelEfficiency = this.analyzeFuelEfficiency(trips, fuelRecords);
    if (fuelEfficiency.score < 0.7) {
      recommendations.push({
        area: 'fuel',
        priority: 'high',
        recommendation: 'تحسين كفاءة استهلاك الوقود',
        potentialSavings: this.calculatePotentialFuelSavings(fuelEfficiency),
        actions: [
          'تدريب السائقين على القيادة الاقتصادية',
          'تحسين صيانة المحركات',
          'تحسين تخطيط المسارات'
        ]
      });
    }

    // تحليل تكاليف الصيانة
    const maintenanceEfficiency = this.analyzeMaintenanceEfficiency(maintenanceRecords);
    if (maintenanceEfficiency.score < 0.7) {
      recommendations.push({
        area: 'maintenance',
        priority: 'medium',
        recommendation: 'تحسين كفاءة الصيانة',
        potentialSavings: this.calculatePotentialMaintenanceSavings(maintenanceEfficiency),
        actions: [
          'تنفيذ برنامج صيانة وقائية',
          'تحسين إدارة قطع الغيار',
          'التعاقد مع موردين أكثر كفاءة'
        ]
      });
    }

    return recommendations;
  }

  // ... المزيد من الوظائف المساعدة ...
}

module.exports = new CostAnalysisService();