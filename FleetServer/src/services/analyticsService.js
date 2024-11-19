const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const Driver = require('../models/Driver');
const Sensor = require('../models/Sensor');

class AnalyticsService {
  async calculateFleetMetrics(companyId, dateRange) {
    const { startDate, endDate } = dateRange;

    const trips = await Trip.find({
      company: companyId,
      startTime: { $gte: startDate },
      endTime: { $lte: endDate }
    });

    return {
      totalTrips: trips.length,
      totalDistance: this.calculateTotalDistance(trips),
      fuelEfficiency: this.calculateAverageFuelEfficiency(trips),
      utilization: await this.calculateFleetUtilization(companyId, trips)
    };
  }

  calculateTotalDistance(trips) {
    return trips.reduce((total, trip) => total + (trip.distance || 0), 0);
  }

  calculateAverageFuelEfficiency(trips) {
    const validTrips = trips.filter(trip => trip.fuelConsumption && trip.distance);
    if (validTrips.length === 0) return 0;

    const totalEfficiency = validTrips.reduce((sum, trip) => 
      sum + (trip.distance / trip.fuelConsumption), 0);
    return totalEfficiency / validTrips.length;
  }

  async calculateFleetUtilization(companyId, trips) {
    const totalVehicles = await Vehicle.countDocuments({ company: companyId });
    const activeVehicles = new Set(trips.map(trip => trip.vehicle.toString())).size;
    return (activeVehicles / totalVehicles) * 100;
  }

  async generateDriverReport(driverId, dateRange) {
    const { startDate, endDate } = dateRange;

    const trips = await Trip.find({
      driver: driverId,
      startTime: { $gte: startDate },
      endTime: { $lte: endDate }
    });

    return {
      totalTrips: trips.length,
      totalDistance: this.calculateTotalDistance(trips),
      averageSpeed: this.calculateAverageSpeed(trips),
      safetyScore: await this.calculateDriverSafetyScore(driverId, trips),
      fuelEfficiency: this.calculateAverageFuelEfficiency(trips)
    };
  }

  async calculateDriverSafetyScore(driverId, trips) {
    // تنفيذ خوارزمية حساب درجة السلامة
    // يمكن أن تعتمد على عوامل مثل:
    // - السرعة الزائدة
    // - الفرملة المفاجئة
    // - التسارع السريع
    // - ساعات القيادة
    return 85; // قيمة مثال
  }

  async generateSensorReport(sensorId, dateRange) {
    const { startDate, endDate } = dateRange;

    const readings = await SensorReading.find({
      sensor: sensorId,
      timestamp: { $gte: startDate, $lte: endDate }
    });

    return {
      totalReadings: readings.length,
      averageValue: this.calculateAverageReading(readings),
      maxValue: this.findMaxReading(readings),
      minValue: this.findMinReading(readings),
      anomalies: this.detectAnomalies(readings)
    };
  }

  detectAnomalies(readings) {
    // تنفيذ خوارزمية اكتشاف القيم الشاذة
    // يمكن استخدام طرق مثل:
    // - Z-score
    // - IQR (Interquartile Range)
    // - Moving Average
    return [];
  }
}

module.exports = new AnalyticsService();