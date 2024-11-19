const Driver = require('../models/Driver');
const Trip = require('../models/Trip');

exports.getAllDrivers = async (req, res, next) => {
  try {
    const drivers = await Driver.find({ company: req.user.company })
      .populate('currentVehicle');
    res.json(drivers);
  } catch (error) {
    next(error);
  }
};

exports.getDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .populate('currentVehicle');
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(driver);
  } catch (error) {
    next(error);
  }
};

exports.createDriver = async (req, res, next) => {
  try {
    const driver = new Driver({
      ...req.body,
      company: req.user.company
    });
    await driver.save();
    res.status(201).json(driver);
  } catch (error) {
    next(error);
  }
};

exports.updateDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(driver);
  } catch (error) {
    next(error);
  }
};

exports.getDriverPerformance = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const trips = await Trip.find({
      driver: req.params.id,
      status: 'completed'
    }).sort('-endTime').limit(10);

    const performance = {
      ...driver.performanceMetrics,
      recentTrips: trips
    };

    res.json(performance);
  } catch (error) {
    next(error);
  }
};