const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Purchase = require('../models/Purchase');
const app = require('../app');

describe('Inventory Integration Tests - Vehicle Purchase & Restock Flow', () => {
  let userToken;
  let adminToken;
  let userId;
  let adminId;
  let vehicleId;

  beforeAll(() => {
    mongoose.set('bufferCommands', false);

    userId = new mongoose.Types.ObjectId().toString();
    adminId = new mongoose.Types.ObjectId().toString();
    vehicleId = new mongoose.Types.ObjectId().toString();

    const secret = process.env.JWT_SECRET || 'supersecret_dealership_jwt_key_2026';
    userToken = jwt.sign({ id: userId, role: 'USER' }, secret);
    adminToken = jwt.sign({ id: adminId, role: 'ADMIN' }, secret);
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

  describe('GET /api/vehicles/my-purchases', () => {
    it('should return HTTP 200 OK with list of purchases for the authenticated customer', async () => {
      const mockUserDoc = { _id: userId, name: 'Buyer User', role: 'USER' };
      const mockPurchases = [
        {
          _id: new mongoose.Types.ObjectId(),
          user: userId,
          vehicle: {
            _id: vehicleId,
            make: 'Porsche',
            model: '911',
            year: 2024,
            price: 130000,
            image: 'https://example.com/porsche.jpg'
          },
          quantity: 1,
          totalPrice: 130000,
          purchaseDate: new Date()
        }
      ];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockPurchases)
      };

      jest.spyOn(User, 'findById').mockResolvedValueOnce(mockUserDoc);
      jest.spyOn(Purchase, 'find').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/api/vehicles/my-purchases')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('results', 1);
      expect(response.body.data).toHaveProperty('purchases');
      expect(response.body.data.purchases[0].vehicle.make).toBe('Porsche');
    });

    it('should return HTTP 401 Unauthorized when requesting my-purchases without auth header', async () => {
      const response = await request(app).get('/api/vehicles/my-purchases');

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('status', 'fail');
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    it('should allow Admin users to restock vehicle quantity and restore Available status (HTTP 200)', async () => {
      const mockAdminDoc = { _id: adminId, name: 'Manager Admin', role: 'ADMIN' };
      const mockDepletedVehicle = {
        _id: vehicleId,
        make: 'Toyota',
        model: 'Corolla',
        quantity: 0,
        status: 'Out of Stock',
        save: jest.fn().mockImplementation(async function () {
          return this;
        })
      };

      jest.spyOn(User, 'findById').mockResolvedValueOnce(mockAdminDoc);
      jest.spyOn(Vehicle, 'findById').mockResolvedValueOnce(mockDepletedVehicle);

      const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ count: 5 });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data).toHaveProperty('vehicle');
      expect(mockDepletedVehicle.quantity).toBe(5);
      expect(mockDepletedVehicle.status).toBe('Available');
      expect(mockDepletedVehicle.save).toHaveBeenCalled();
    });

    it('should return HTTP 403 Forbidden when a non-admin user attempts to restock', async () => {
      const mockUserDoc = { _id: userId, name: 'Standard User', role: 'USER' };
      jest.spyOn(User, 'findById').mockResolvedValueOnce(mockUserDoc);

      const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ count: 5 });

      expect(response.statusCode).toBe(403);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toMatch(/admin/i);
    });

    it('should return HTTP 400 Bad Request for zero or negative restock amounts', async () => {
      const mockAdminDoc = { _id: adminId, name: 'Manager Admin', role: 'ADMIN' };
      jest.spyOn(User, 'findById').mockResolvedValueOnce(mockAdminDoc);

      const responseZero = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ count: 0 });

      expect(responseZero.statusCode).toBe(400);
      expect(responseZero.body).toHaveProperty('status', 'fail');
      expect(responseZero.body.message).toMatch(/positive/i);

      jest.spyOn(User, 'findById').mockResolvedValueOnce(mockAdminDoc);
      const responseNegative = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ count: -3 });

      expect(responseNegative.statusCode).toBe(400);
      expect(responseNegative.body).toHaveProperty('status', 'fail');
    });
  });
});
