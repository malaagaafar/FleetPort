const Vehicle = require('../models/Vehicle');
const MaintenanceRecord = require('../models/MaintenanceRecord');
const SensorData = require('../models/SensorData');
const TelemetryData = require('../models/TelemetryData');
const MachineLearningService = require('./machineLearningService');
const logger = require('../utils/logger');

class PredictiveMaintenanceService {
  async analyzeMaintenance(vehicleId) {
    try {
      const [
        vehicle,
        maintenanceHistory,
        sensorData,
        telemetryData
      ] = await Promise.all([
        Vehicle.findById(vehicleId),
        this.getMaintenanceHistory(vehicleId),
        this.getRecentSensorData(vehicleId),
        this.getRecentTelemetryData(vehicleId)
      ]);

      if (!vehicle) {
        throw new Error('المركبة غير موجودة');
      }

      const analysis = {
        vehicleInfo: this.getVehicleInfo(vehicle),
        healthStatus: await this.analyzeVehicleHealth(vehicle, sensorData, telemetryData),
        maintenancePredictions: await this.predictMaintenanceNeeds(
          vehicle,
          maintenanceHistory,
          sensorData,
          telemetryData
        ),
        componentAnalysis: await this.analyzeComponents(
          vehicle,
          sensorData,
          telemetryData
        ),
        recommendations: this.generateMaintenanceRecommendations(
          vehicle,
          maintenanceHistory,
          sensorData,
          telemetryData
        )
      };

      await this.updateVehicleHealthStatus(vehicleId, analysis.healthStatus);
      return analysis;
    } catch (error) {
      logger.error('Predictive maintenance analysis failed:', {
        vehicleId,
        error: error.message
      });
      throw error;
    }
  }

  async getMaintenanceHistory(vehicleId) {
    return MaintenanceRecord.find({ vehicle: vehicleId })
      .sort('-completedDate');
  }

  async getRecentSensorData(vehicleId) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return SensorData.find({
      vehicle: vehicleId,
      timestamp: { $gte: thirtyDaysAgo }
    }).sort('timestamp');
  }

  async getRecentTelemetryData(vehicleId) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return TelemetryData.find({
      vehicle: vehicleId,
      timestamp: { $gte: thirtyDaysAgo }
    }).sort('timestamp');
  }

  getVehicleInfo(vehicle) {
    return {
      id: vehicle._id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      mileage: vehicle.mileage,
      lastMaintenanceDate: vehicle.lastMaintenanceDate
    };
  }

  async analyzeVehicleHealth(vehicle, sensorData, telemetryData) {
    const componentHealth = await this.analyzeComponentHealth(
      sensorData,
      telemetryData
    );

    const overallHealth = this.calculateOverallHealth(componentHealth);
    const anomalies = await this.detectAnomalies(sensorData, telemetryData);
    const trends = this.analyzeTrends(sensorData, telemetryData);

    return {
      timestamp: new Date(),
      overallHealth,
      componentHealth,
      anomalies,
      trends
    };
  }

  async predictMaintenanceNeeds(vehicle, maintenanceHistory, sensorData, telemetryData) {
    const predictions = await MachineLearningService.predictMaintenance({
      vehicleData: this.prepareVehicleData(vehicle),
      maintenanceHistory: this.prepareMaintenanceData(maintenanceHistory),
      sensorData: this.prepareSensorData(sensorData),
      telemetryData: this.prepareTelemetryData(telemetryData)
    });

    return {
      nextMaintenanceDate: predictions.nextMaintenanceDate,
      predictedIssues: predictions.issues,
      reliability: predictions.reliability,
      riskFactors: predictions.riskFactors
    };
  }

  async analyzeComponents(vehicle, sensorData, telemetryData) {
    const components = [
      'engine',
      'transmission',
      'brakes',
      'battery',
      'tires',
      'suspension'
    ];

    const analysisResults = {};
    for (const component of components) {
      analysisResults[component] = await this.analyzeComponent(
        component,
        vehicle,
        sensorData,
        telemetryData
      );
    }

    return analysisResults;
  }

  async analyzeComponent(component, vehicle, sensorData, telemetryData) {
    const componentData = this.extractComponentData(
      component,
      sensorData,
      telemetryData
    );

    const analysis = await MachineLearningService.analyzeComponentHealth({
      component,
      vehicleData: this.prepareVehicleData(vehicle),
      componentData
    });

    return {
      health: analysis.health,
      predictedLifespan: analysis.predictedLifespan,
      warningSign: analysis.warningSigns,
      recommendations: analysis.recommendations
    };
  }

  generateMaintenanceRecommendations(vehicle, maintenanceHistory, sensorData, telemetryData) {
    const recommendations = [];

    // تحليل حالة المركبة وإضافة التوصيات
    const vehicleCondition = this.analyzeVehicleCondition(
      vehicle,
      maintenanceHistory,
      sensorData,
      telemetryData
    );

    if (vehicleCondition.requiresImmediate.length > 0) {
      recommendations.push({
        priority: 'عاجل',
        items: vehicleCondition.requiresImmediate,
        timeline: 'فوري',
        estimatedCost: this.estimateMaintenanceCost(vehicleCondition.requiresImmediate)
      });
    }

    if (vehicleCondition.requiresSoon.length > 0) {
      recommendations.push({
        priority: 'قريب',
        items: vehicleCondition.requiresSoon,
        timeline: 'خلال 30 يوم',
        estimatedCost: this.estimateMaintenanceCost(vehicleCondition.requiresSoon)
      });
    }

    return recommendations;
  }

  // ... المزيد من الوظائف المساعدة ...
}

module.exports = new PredictiveMaintenanceService();