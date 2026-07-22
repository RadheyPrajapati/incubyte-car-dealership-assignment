const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', inventoryRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Car Dealership API is up and running',
    timestamp: new Date().toISOString()
  });
});

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Cannot find ${req.originalUrl} on this server`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path || 'ID'} format: ${err.value}`;
  }

  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
