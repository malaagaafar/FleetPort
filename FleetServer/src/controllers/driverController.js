// src/controllers/driverController.js
const Driver = require('../models/Driver');

exports.getAllDrivers = async (req, res, next) => {
  try {
    const drivers = await Driver.findAll();
    res.json(drivers);
  } catch (error) {
    next(error);
  }
};

exports.getDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
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
    const driver = await Driver.create(req.body);
    res.status(201).json(driver);
  } catch (error) {
    next(error);
  }
};

exports.updateDriver = async (req, res, next) => {
  try {
    const [updated] = await Driver.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    const updatedDriver = await Driver.findByPk(req.params.id);
    res.json(updatedDriver);
  } catch (error) {
    next(error);
  }
};

exports.deleteDriver = async (req, res, next) => {
  try {
    const deleted = await Driver.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};