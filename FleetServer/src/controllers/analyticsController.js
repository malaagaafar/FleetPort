const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const Driver = require('../models/Driver');
const Sensor = require('../models/Sensor');

exports.getFleetOverview = async (req, res, next) => {
  try {
    const [
      totalVehicles,
      activeVehicles,
      totalDrivers,
      activeTrips,
      completedTrips
    ] = await Promise.all([
      Vehicle.countDocuments({ company: req.user.company }),
      Vehicle.countDocuments({ company: req.user.company, status: 'active' }),
      Driver.countDocuments({ company: req.user.company }),
      Trip.countDocuments({ company: req.user.company, status: 'inProgress' }),
      Trip.countDocuments({ 
        company: req.user.company, 
        status: 'completed',
        endTime: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      })
    ]);

    res.json({
      fleet: {
        totalVehicles,
        activeVehicles,
        utilizationRate: (activeVehicles / totalVehicles) * 100
      },
      workforce: {
        totalDrivers,
        activeTrips
      },
      performance: {
        completedTrips,
        tripSuccessRate: (completedTrips / (completedTrips + activeTrips)) * 100
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getFuelConsumptionAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const trips = await Trip.find({
      company: req.user.company,
      status: 'completed',
      startTime: { $gte: new Date(startDate) },
      endTime: { $lte: new Date(endDate) }
    }).populate('vehicle');

    const fuelAnalytics = trips.reduce((acc, trip) => {
      const vehicleType = trip.vehicle.type;
      if (!acc[vehicleType]) {
        acc[vehicleType] = {
          totalFuel: 0,
          totalDistance: 0,
          trips: 0
        };
      }
      
      acc[vehicleType].totalFuel += trip.fuelConsumption;
      acc[vehicleType].totalDistance += trip.distance;
      acc[vehicleType].trips++;
      
      return acc;
    }, {});

    res.json(fuelAnalytics);
  } catch (error) {
    next(error);
  }
};

exports.getDriverPerformanceAnalytics = async (req, res, next) => {
  try {
    const drivers = await Driver.find({ company: req.user.company })
      .populate({
        path: 'trips',
        match: { status: 'completed' },
        options: { sort: { endTime: -1 }, limit: 10 }
      });

    const driverAnalytics = drivers.map(driver => ({
      driverId: driver._id,
      name: `${driver.firstName} ${driver.lastName}`,
      performanceMetrics: driver.performanceMetrics,
      recentTrips: driver.trips.map(trip => ({
        tripId: trip._id,
        distance: trip.distance,
        fuelEfficiency: trip.distance / trip.fuelConsumption,
        duration: trip.duration
      }))
    }));

    res.json(driverAnalytics);
  } catch (error) {
    next(error);
  }
};