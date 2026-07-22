const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Purchase = require('../models/Purchase');
const app = require('../app');

describe('Inventory Integration Tests - Vehicle Purchase Flow', () => {
  let userToken;
  let userId;
  let vehicleId;

  beforeAll(() => {
    mongoose.set('bufferCommands', false);

    userId = new mongoose.Types.ObjectId().toString();
    vehicleId = new mongoose.Types.ObjectId().toString();

    const secret = process.env.JWT_SECRET || 'supersecret_dealership_jwt_key_2026';
    userToken = jwt.sign({ id: userId, role: 'USER' }, secret);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    it('should process purchase, decrease vehicle quantity by 1, and record a Purchase transaction (HTTP 200)', async () => {
      const mockUserDoc = { _id: userId, name: 'Buyer User', role: 'USER' };
      const initialVehicle = {
        _id: vehicleId,
        make: 'Honda',
        model: 'Accord',
        price: 28000,
        quantity: 3,
        status: 'Available',
        save: jest.fn().mockImplementation(async function () {
          this.quantity -= 1;
          if (this.quantity === 0) this.status = 'Out of Stock';
          return this;
        })
      };

      const mockPurchaseRecord = {
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        vehicle: vehicleId,
        quantity: 1,
        totalPrice: 28000,
        status: 'Completed'
      };

      jest.spyOn(User, 'findById').mockResolvedValueOnce(mockUserDoc);
      jest.spyOn(Vehicle, 'findById').mockResolvedValueOnce(initialVehicle);
      jest.spyOn(Purchase, 'create').mockResolvedValueOnce(mockPurchaseRecord);

      const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data).toHaveProperty('purchase');
      expect(response.body.data).toHaveProperty('vehicle');
      expect(initialVehicle.save).toHaveBeenCalled();
      expect(Purchase.create).toHaveBeenCalledWith({
        user: userId,
        vehicle: vehicleId,
        quantity: 1,
        totalPrice: 28000
      });
    });

    it('should return HTTP 400 Bad Request when attempting to purchase an out-of-stock vehicle (quantity === 0)', async () => {
      const mockUserDoc = { _id: userId, name: 'Buyer User', role: 'USER' };
      const outOfStockVehicle = {
        _id: vehicleId,
        make: 'Honda',
        model: 'Accord',
        price: 28000,
        quantity: 0,
        status: 'Out of Stock'
      };

      jest.spyOn(User, 'findById').mockResolvedValueOnce(mockUserDoc);
      jest.spyOn(Vehicle, 'findById').mockResolvedValueOnce(outOfStockVehicle);

      const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toMatch(/out of stock/i);
    });

    it('should return HTTP 401 Unauthorized when no Authorization header is provided', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`);

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('status', 'fail');
    });

    it('should return HTTP 404 Not Found when purchasing a non-existent vehicle ID', async () => {
      const mockUserDoc = { _id: userId, name: 'Buyer User', role: 'USER' };
      jest.spyOn(User, 'findById').mockResolvedValueOnce(mockUserDoc);
      jest.spyOn(Vehicle, 'findById').mockResolvedValueOnce(null);

      const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toMatch(/vehicle not found/i);
    });
  });
});
