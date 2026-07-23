const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
const Purchase = require('../models/Purchase');

exports.purchaseVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'fail',
        message: `Invalid vehicle ID format: ${id}`
      });
    }

    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({
        status: 'fail',
        message: 'Vehicle not found with that ID'
      });
    }

    if (vehicle.quantity <= 0 || vehicle.status === 'Out of Stock') {
      return res.status(400).json({
        status: 'fail',
        message: 'Vehicle is out of stock'
      });
    }

    // Decrease vehicle inventory quantity by 1
    if (typeof vehicle.save === 'function') {
      if (typeof vehicle.quantity === 'number') {
        vehicle.quantity -= 1;
        if (vehicle.quantity === 0) {
          vehicle.status = 'Out of Stock';
        }
      }
      await vehicle.save();
    }

    // Record purchase transaction details in Purchase model
    const purchase = await Purchase.create({
      user: userId,
      vehicle: vehicle._id,
      quantity: 1,
      totalPrice: vehicle.price
    });

    res.status(200).json({
      status: 'success',
      message: 'Vehicle purchased successfully',
      data: {
        purchase,
        vehicle
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyPurchases = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const purchases = await Purchase.find({ user: userId })
      .populate('vehicle')
      .sort({ purchaseDate: -1 });

    res.status(200).json({
      status: 'success',
      results: purchases.length,
      data: {
        purchases
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.restockVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const restockCount = req.body.count !== undefined ? req.body.count : req.body.quantity;

    // Validate restock quantity (must be a positive integer > 0)
    if (restockCount === undefined || typeof restockCount !== 'number' || restockCount <= 0 || !Number.isInteger(restockCount)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Restock count must be a positive integer greater than zero'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'fail',
        message: `Invalid vehicle ID format: ${id}`
      });
    }

    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({
        status: 'fail',
        message: 'Vehicle not found with that ID'
      });
    }

    vehicle.quantity = (vehicle.quantity || 0) + restockCount;
    if (vehicle.quantity > 0) {
      vehicle.status = 'Available';
    }

    if (typeof vehicle.save === 'function') {
      await vehicle.save();
    }

    res.status(200).json({
      status: 'success',
      message: 'Vehicle restocked successfully',
      data: {
        vehicle
      }
    });
  } catch (error) {
    next(error);
  }
};
