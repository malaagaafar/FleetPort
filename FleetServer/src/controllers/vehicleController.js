const Vehicle = require('../models/Vehicle');
const TelematicsService = require('../services/telematicsService');

exports.getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ company: req.user.company })
      .populate('currentDriver')
      .populate('sensors');
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
};

exports.getVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('currentDriver')
      .populate('sensors');
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};

exports.createVehicle = async (req, res, next) => {
  try {
    const vehicle = new Vehicle({
      ...req.body,
      company: req.user.company
    });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    next(error);
  }
};

exports.updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};

exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.getVehicleLocation = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    const location = await TelematicsService.getVehicleLocation(vehicle.telematicsDeviceId);
    res.json(location);
  } catch (error) {
    next(error);
  }
};