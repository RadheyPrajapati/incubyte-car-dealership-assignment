const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

describe('Auth Integration Tests - POST /api/auth/register (TDD Red Phase)', () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI_TEST || 'mongodb://127.0.0.1:27017/car_dealership_test';
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 1500 });
    } catch (err) {
      console.warn('MongoDB connection skipped in test environment:', err.message);
    }
  }, 10000);

  afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await User.deleteMany({});
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  });

  describe('POST /api/auth/register', () => {
    it('should return HTTP 201 Created with a JWT token and user details for valid input', async () => {
      const newUser = {
        name: 'Jane Customer',
        email: 'jane@dealership.com',
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(newUser.email);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should return HTTP 400 Bad Request when missing required fields', async () => {
      const incompleteUser = {
        email: 'missingname@dealership.com'
        // missing name and password
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteUser);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
    });

    it('should return HTTP 400 Bad Request for duplicate email registration', async () => {
      const existingUser = {
        name: 'Existing User',
        email: 'duplicate@dealership.com',
        password: 'Password123!'
      };

      // Register first user
      await request(app).post('/api/auth/register').send(existingUser);

      // Attempt to register again with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(existingUser);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toMatch(/already registered|already exists|duplicate/i);
    });
  });
});
