const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for purchase transaction']
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle ID is required for purchase transaction']
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Purchase quantity must be at least 1'],
      default: 1
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative']
    },
    purchaseDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'Cancelled'],
      default: 'Completed'
    }
  },
  {
    timestamps: true
  }
);

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
