const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const MaintenanceRecord = require('../models/MaintenanceRecord');
const Driver = require('../models/Driver');
const Formatters = require('../utils/formatters');
const logger = require('../utils/logger');

class AdvancedReportService {
  async generateComprehensiveReport(companyId, options) {
    try {
      const { startDate, endDate, format = 'pdf' } = options;
      
      // جمع البيانات
      const data = await this.collectReportData(companyId, startDate, endDate);
      
      // إنشاء التقرير بالتنسيق المطلوب
      switch (format.toLowerCase()) {
        case 'pdf':
          return this.generatePDFReport(data);
        case 'excel':
          return this.generateExcelReport(data);
        case 'json':
          return data;
        default:
          throw new Error('تنسيق التقرير غير مدعوم');
      }
    } catch (error) {
      logger.error('Failed to generate comprehensive report:', {
        companyId,
        error: error.message
      });
      throw error;
    }
  }

  async collectReportData(companyId, startDate, endDate) {
    const [
      vehicles,
      trips,
      maintenanceRecords,
      drivers
    ] = await Promise.all([
      Vehicle.find({ company: companyId }),
      Trip.find({
        company: companyId,
        startTime: { $gte: startDate, $lte: endDate }
      }),
      MaintenanceRecord.find({
        company: companyId,
        scheduledDate: { $gte: startDate, $lte: endDate }
      }),
      Driver.find({ company: companyId })
    ]);

    return {
      fleetMetrics: this.calculateFleetMetrics(vehicles, trips),
      tripAnalytics: this.analyzeTripData(trips),
      maintenanceAnalytics: this.analyzeMaintenanceData(maintenanceRecords),
      driverPerformance: this.analyzeDriverPerformance(drivers, trips),
      costAnalysis: this.analyzeCosts(trips, maintenanceRecords),
      summary: this.generateSummary({
        vehicles, trips, maintenanceRecords, drivers
      })
    };
  }

  async generatePDFReport(data) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50
        });

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // إضافة ترويسة التقرير
        this.addReportHeader(doc);

        // إضافة أقسام التقرير
        this.addFleetMetricsSection(doc, data.fleetMetrics);
        this.addTripAnalyticsSection(doc, data.tripAnalytics);
        this.addMaintenanceSection(doc, data.maintenanceAnalytics);
        this.addDriverPerformanceSection(doc, data.driverPerformance);
        this.addCostAnalysisSection(doc, data.costAnalysis);
        this.addSummarySection(doc, data.summary);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  async generateExcelReport(data) {
    const workbook = new ExcelJS.Workbook();

    // إضافة ورقات العمل
    this.addFleetMetricsSheet(workbook, data.fleetMetrics);
    this.addTripAnalyticsSheet(workbook, data.tripAnalytics);
    this.addMaintenanceSheet(workbook, data.maintenanceAnalytics);
    this.addDriverPerformanceSheet(workbook, data.driverPerformance);
    this.addCostAnalysisSheet(workbook, data.costAnalysis);
    this.addSummarySheet(workbook, data.summary);

    return workbook.xlsx.writeBuffer();
  }

  calculateFleetMetrics(vehicles, trips) {
    return {
      totalVehicles: vehicles.length,
      activeVehicles: vehicles.filter(v => v.status === 'active').length,
      totalTrips: trips.length,
      totalDistance: trips.reduce((sum, trip) => sum + (trip.distance || 0), 0),
      averageTripsPerDay: this.calculateAverageTripsPerDay(trips),
      vehicleUtilization: this.calculateVehicleUtilization(vehicles, trips)
    };
  }

  analyzeTripData(trips) {
    return {
      tripsByStatus: this.groupTripsByStatus(trips),
      averageTripDuration: this.calculateAverageTripDuration(trips),
      peakHours: this.analyzePeakHours(trips),
      routeAnalysis: this.analyzeRoutes(trips)
    };
  }

  analyzeMaintenanceData(records) {
    return {
      maintenanceByType: this.groupMaintenanceByType(records),
      averageCost: this.calculateAverageMaintenanceCost(records),
      upcomingMaintenance: this.getUpcomingMaintenance(records),
      maintenanceCompliance: this.calculateMaintenanceCompliance(records)
    };
  }

  analyzeDriverPerformance(drivers, trips) {
    return {
      driverStats: this.calculateDriverStats(drivers, trips),
      safetyScores: this.calculateDriverSafetyScores(trips),
      topPerformers: this.identifyTopPerformers(drivers, trips)
    };
  }

  analyzeCosts(trips, maintenanceRecords) {
    return {
      fuelCosts: this.calculateFuelCosts(trips),
      maintenanceCosts: this.calculateTotalMaintenanceCosts(maintenanceRecords),
      costPerKilometer: this.calculateCostPerKilometer(trips, maintenanceRecords),
      costTrends: this.analyzeCostTrends(trips, maintenanceRecords)
    };
  }

  // ... المزيد من الوظائف المساعدة ...
}

module.exports = new AdvancedReportService();