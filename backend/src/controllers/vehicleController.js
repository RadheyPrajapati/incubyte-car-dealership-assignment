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

exports.searchVehicles = async (req, res, next) => {
  try {
    const { make, model, category, status, minPrice, maxPrice, minYear, maxYear } = req.query;

    const query = {};

    if (make) {
      query.make = { $regex: make, $options: 'i' };
    }

    if (model) {
      query.model = { $regex: model, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        query.price.$lte = Number(maxPrice);
      }
    }

    if (minYear !== undefined || maxYear !== undefined) {
      query.year = {};
      if (minYear !== undefined && minYear !== '') {
        query.year.$gte = Number(minYear);
      }
      if (maxYear !== undefined && maxYear !== '') {
        query.year.$lte = Number(maxYear);
      }
    }

    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });

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
