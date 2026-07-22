const mongoose = require('mongoose');

const vehicleCategories = [
  'Sedan',
  'SUV',
  'Truck',
  'Coupe',
  'Convertible',
  'Wagon',
  'Van',
  'Electric',
  'Hybrid'
];

const vehicleStatuses = ['Available', 'Reserved', 'Sold', 'Out of Stock'];

const vehicleSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: [true, 'Vehicle make is required'],
      trim: true
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true
    },
    year: {
      type: Number,
      required: [true, 'Vehicle year is required'],
      min: [1900, 'Year must be after 1900'],
      max: [new Date().getFullYear() + 2, 'Year cannot be in the distant future']
    },
    category: {
      type: String,
      required: [true, 'Vehicle category is required'],
      enum: {
        values: vehicleCategories,
        message: '{VALUE} is not a valid vehicle category'
      },
      default: 'Sedan'
    },
    price: {
      type: Number,
      required: [true, 'Vehicle price is required'],
      min: [0, 'Price must be a non-negative number']
    },
    quantity: {
      type: Number,
      required: [true, 'Vehicle quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 1
    },
    status: {
      type: String,
      enum: {
        values: vehicleStatuses,
        message: '{VALUE} is not a valid status'
      },
      default: 'Available'
    },
    vin: {
      type: String,
      trim: true,
      uppercase: true
    },
    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
