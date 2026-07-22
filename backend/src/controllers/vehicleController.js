const Vehicle = require('../models/Vehicle');

exports.createVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        vehicle
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
    next(error);
  }
};

exports.getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: vehicles.length,
      data: {
        vehicles
      }
    });
  } catch (error) {
    next(error);
  }
};
