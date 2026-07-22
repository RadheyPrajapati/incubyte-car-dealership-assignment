const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');

describe('Vehicle Model Unit Tests (TDD)', () => {
  describe('Vehicle Schema Validation & Defaults', () => {
    it('should validate a complete vehicle object and apply default category, status, and quantity', () => {
      const vehicleData = {
        make: 'Toyota',
        model: 'Camry',
        year: 2024,
        category: 'Sedan',
        price: 26500,
        quantity: 5
      };

      const vehicle = new Vehicle(vehicleData);
      const err = vehicle.validateSync();

      expect(err).toBeUndefined();
      expect(vehicle.make).toBe('Toyota');
      expect(vehicle.model).toBe('Camry');
      expect(vehicle.year).toBe(2024);
      expect(vehicle.category).toBe('Sedan');
      expect(vehicle.price).toBe(26500);
      expect(vehicle.quantity).toBe(5);
      expect(vehicle.status).toBe('Available');
    });

    it('should default category to Sedan, quantity to 1, and status to Available when omitted', () => {
      const vehicle = new Vehicle({
        make: 'Honda',
        model: 'Civic',
        year: 2023,
        price: 24000
      });

      const err = vehicle.validateSync();
      expect(err).toBeUndefined();
      expect(vehicle.category).toBe('Sedan');
      expect(vehicle.quantity).toBe(1);
      expect(vehicle.status).toBe('Available');
    });

    it('should require make, model, year, and price fields', () => {
      const vehicle = new Vehicle({});
      const err = vehicle.validateSync();

      expect(err).toBeDefined();
      expect(err.errors.make).toBeDefined();
      expect(err.errors.model).toBeDefined();
      expect(err.errors.year).toBeDefined();
      expect(err.errors.price).toBeDefined();
    });

    it('should reject negative price and quantity values', () => {
      const vehicle = new Vehicle({
        make: 'Tesla',
        model: 'Model 3',
        year: 2023,
        category: 'Electric',
        price: -40000,
        quantity: -2
      });

      const err = vehicle.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.price).toBeDefined();
      expect(err.errors.quantity).toBeDefined();
    });

    it('should reject invalid category enums', () => {
      const vehicle = new Vehicle({
        make: 'Ford',
        model: 'F-150',
        year: 2022,
        category: 'Rocketship',
        price: 45000,
        quantity: 2
      });

      const err = vehicle.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.category).toBeDefined();
    });
  });
});
