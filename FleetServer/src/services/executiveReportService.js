const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const Driver = require('../models/Driver');
const MaintenanceRecord = require('../models/MaintenanceRecord');
const AnalyticsService = require('./analyticsService');
const RiskAnalysisService = require('./riskAnalysisService');
const logger = require('../utils/logger');

class ExecutiveReportService {
  async generateExecutiveSummary(companyId, dateRange) {
    try {
      const [
        fleetMetrics,
        operationalMetrics,
        financialMetrics,
        safetyMetrics,
        riskAnalysis
      ] = await Promise.all([
        this.getFleetMetrics(companyId, dateRange),
        this.getOperationalMetrics(companyId, dateRange),
        this.getFinancialMetrics(companyId, dateRange),
        this.getSafetyMetrics(companyId, dateRange),
        this.getRiskAnalysis(companyId)
      ]);

      return {
        reportPeriod: dateRange,
        summary: this.generateSummaryHighlights({
          fleetMetrics,
          operationalMetrics,
          financialMetrics,
          safetyMetrics
        }),
        fleetPerformance: fleetMetrics,
        operations: operationalMetrics,
        financials: financialMetrics,
        safety: safetyMetrics,
        risks: riskAnalysis,
        recommendations: this.generateStrategicRecommendations({
          fleetMetrics,
          operationalMetrics,
          financialMetrics,
          safetyMetrics,
          riskAnalysis
        })
      };
    } catch (error) {
      logger.error('Failed to generate executive summary:', {
        companyId,
        error: error.message
      });
      throw error;
    }
  }

  async getFleetMetrics(companyId, dateRange) {
    const vehicles = await Vehicle.find({ company: companyId });
    const trips = await Trip.find({
      company: companyId,
      startTime: { $gte: dateRange.start, $lte: dateRange.end }
    });

    const maintenanceRecords = await MaintenanceRecord.find({
      company: companyId,
      scheduledDate: { $gte: dateRange.start, $lte: dateRange.end }
    });

    return {
      fleetSize: vehicles.length,
      activeVehicles: vehicles.filter(v => v.status === 'active').length,
      utilization: this.calculateFleetUtilization(vehicles, trips),
      maintenance: this.analyzeMaintenanceMetrics(maintenanceRecords),
      efficiency: this.calculateFleetEfficiency(vehicles, trips),
      trends: await this.analyzeFleetTrends(companyId, dateRange)
    };
  }

  async getOperationalMetrics(companyId, dateRange) {
    const trips = await Trip.find({
      company: companyId,
      startTime: { $gte: dateRange.start, $lte: dateRange.end }
    }).populate('driver vehicle');

    return {
      totalTrips: trips.length,
      completedTrips: trips.filter(t => t.status === 'completed').length,
      onTimeDelivery: this.calculateOnTimeDeliveryRate(trips),
      routeEfficiency: await this.analyzeRouteEfficiency(trips),
      driverPerformance: await this.analyzeDriverPerformance(trips),
      customerSatisfaction: await this.analyzeCustomerSatisfaction(trips)
    };
  }

  async getFinancialMetrics(companyId, dateRange) {
    const [trips, maintenanceRecords] = await Promise.all([
      Trip.find({
        company: companyId,
        startTime: { $gte: dateRange.start, $lte: dateRange.end }
      }),
      MaintenanceRecord.find({
        company: companyId,
        scheduledDate: { $gte: dateRange.start, $lte: dateRange.end }
      })
    ]);

    return {
      revenue: this.calculateTotalRevenue(trips),
      costs: this.analyzeCosts(trips, maintenanceRecords),
      profitability: this.analyzeProfitability(trips, maintenanceRecords),
      roi: this.calculateROI(trips, maintenanceRecords),
      trends: this.analyzeFinancialTrends(trips, maintenanceRecords)
    };
  }

  async getSafetyMetrics(companyId, dateRange) {
    const events = await Event.find({
      company: companyId,
      timestamp: { $gte: dateRange.start, $lte: dateRange.end }
    });

    return {
      safetyScore: this.calculateOverallSafetyScore(events),
      incidents: this.analyzeIncidents(events),
      compliance: await this.analyzeComplianceMetrics(companyId, dateRange),
      training: await this.analyzeTrainingEffectiveness(companyId, dateRange),
      trends: this.analyzeSafetyTrends(events)
    };
  }

  generateSummaryHighlights(metrics) {
    return {
      keyAchievements: this.identifyKeyAchievements(metrics),
      challenges: this.identifyChallenges(metrics),
      opportunities: this.identifyOpportunities(metrics),
      risks: this.identifyKeyRisks(metrics)
    };
  }

  generateStrategicRecommendations(data) {
    const recommendations = [];

    // تحليل الأداء المالي
    if (data.financials.profitability.margin < 0.15) {
      recommendations.push({
        area: 'financial',
        priority: 'high',
        recommendation: 'تحسين هوامش الربح من خلال تحسين كفاءة التشغيل وإدارة التكاليف',
        actions: [
          'مراجعة وتحسين استهلاك الوقود',
          'تحسين جدولة الصيانة الوقائية',
          'تحسين تخطيط المسارات'
        ]
      });
    }

    // تحليل السلامة
    if (data.safety.safetyScore < 85) {
      recommendations.push({
        area: 'safety',
        priority: 'high',
        recommendation: 'تحسين معايير السلامة وتقليل الحوادث',
        actions: [
          'تكثيف برامج تدريب السائقين',
          'تحديث أنظمة مراقبة السلامة',
          'مراجعة وتحديث إجراءات السلامة'
        ]
      });
    }

    // تحليل العمليات
    const operationalEfficiency = data.operations.routeEfficiency.score;
    if (operationalEfficiency < 0.8) {
      recommendations.push({
        area: 'operations',
        priority: 'medium',
        recommendation: 'تحسين كفاءة العمليات التشغيلية',
        actions: [
          'تحسين تخطيط المسارات',
          'تحسين إدارة الأسطول',
          'تحسين جدولة السائقين'
        ]
      });
    }

    return recommendations;
  }

  // ... المزيد من الوظائف المساعدة ...
}

module.exports = new ExecutiveReportService();