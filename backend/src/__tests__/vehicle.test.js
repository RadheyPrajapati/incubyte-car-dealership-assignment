const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const app = require('../app');

describe('Vehicle Integration Tests', () => {
  let adminToken;
  let userToken;
  let adminId;
  let userId;

  beforeAll(() => {
    mongoose.set('bufferCommands', false);

    adminId = new mongoose.Types.ObjectId().toString();
    userId = new mongoose.Types.ObjectId().toString();

    const secret = process.env.JWT_SECRET || 'supersecret_dealership_jwt_key_2026';
    adminToken = jwt.sign({ id: adminId, role: 'ADMIN' }, secret);
    userToken = jwt.sign({ id: userId, role: 'USER' }, secret);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /api/vehicles', () => {
    const validVehiclePayload = {
      make: 'Ford',
      model: 'Mustang',
      year: 2024,
      category: 'Coupe',
      price: 32000,
      quantity: 3,
      description: 'V8 Fastback Coupe'
    };

    it('should return HTTP 201 Created and return vehicle object when created by an Admin user', async () => {
      const mockAdminDoc = { _id: adminId, role: 'ADMIN', name: 'Admin User' };
      const mockCreatedVehicle = {
        _id: new mongoose.Types.ObjectId(),
        ...validVehiclePayload,
        status: 'Available'
      };

      jest.spyOn(User, 'findById').mockResolvedValueOnce(mockAdminDoc);
      jest.spyOn(Vehicle, 'create').mockResolvedValueOnce(mockCreatedVehicle);

      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validVehiclePayload);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data).toHaveProperty('vehicle');
      expect(response.body.data.vehicle.make).toBe('Ford');
      expect(response.body.data.vehicle.model).toBe('Mustang');
    });

    it('should return HTTP 403 Forbidden when a non-admin user attempts to create a vehicle', async () => {
      const mockUserDoc = { _id: userId, role: 'USER', name: 'Standard User' };
      jest.spyOn(User, 'findById').mockResolvedValueOnce(mockUserDoc);

      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validVehiclePayload);

      expect(response.statusCode).toBe(403);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toMatch(/admin/i);
    });

    it('should return HTTP 401 Unauthorized when no Authorization header is provided', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .send(validVehiclePayload);

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('status', 'fail');
    });

    it('should return HTTP 400 Bad Request when request body violates Zod validation rules', async () => {
      const mockAdminDoc = { _id: adminId, role: 'ADMIN', name: 'Admin User' };
      jest.spyOn(User, 'findById').mockResolvedValueOnce(mockAdminDoc);

      const invalidPayload = {
        make: '',
        model: 'Mustang',
        year: 1800,
        price: -500
      };

      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidPayload);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
    });
  });

  describe('GET /api/vehicles', () => {
    it('should return HTTP 200 OK with a list of vehicles sorted by creation date descending', async () => {
      const mockVehicles = [
        {
          _id: new mongoose.Types.ObjectId(),
          make: 'Tesla',
          model: 'Model Y',
          year: 2024,
          category: 'Electric',
          price: 45000,
          createdAt: new Date('2026-07-22T10:00:00Z')
        },
        {
          _id: new mongoose.Types.ObjectId(),
          make: 'Toyota',
          model: 'RAV4',
          year: 2023,
          category: 'SUV',
          price: 28000,
          createdAt: new Date('2026-07-20T10:00:00Z')
        }
      ];

      // Mock chainable Vehicle.find().sort({ createdAt: -1 })
      const mockQuery = {
        sort: jest.fn().mockResolvedValue(mockVehicles)
      };
      jest.spyOn(Vehicle, 'find').mockReturnValue(mockQuery);

      const response = await request(app).get('/api/vehicles');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('results', 2);
      expect(response.body.data).toHaveProperty('vehicles');
      expect(Array.isArray(response.body.data.vehicles)).toBe(true);
      expect(response.body.data.vehicles.length).toBe(2);
      expect(response.body.data.vehicles[0].make).toBe('Tesla');
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
    });
  });
});
