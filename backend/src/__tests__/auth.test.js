const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');
const app = require('../app');

describe('Auth Integration Tests - POST /api/auth/register', () => {
  beforeAll(() => {
    mongoose.set('bufferCommands', false);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should return HTTP 201 Created with a JWT token and user details for valid input', async () => {
      const newUser = {
        name: 'Jane Customer',
        email: 'jane@dealership.com',
        password: 'Password123!'
      };

      jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(User.prototype, 'save').mockResolvedValueOnce({
        _id: new mongoose.Types.ObjectId(),
        name: newUser.name,
        email: newUser.email.toLowerCase(),
        role: 'USER',
        toObject: function () {
          return {
            _id: this._id,
            name: this.name,
            email: this.email,
            role: this.role
          };
        }
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(newUser.email.toLowerCase());
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

      // Mock findOne to return existing user document
      jest.spyOn(User, 'findOne').mockResolvedValueOnce({
        _id: new mongoose.Types.ObjectId(),
        name: existingUser.name,
        email: existingUser.email.toLowerCase(),
        role: 'USER'
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(existingUser);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toMatch(/already registered|already exists|duplicate/i);
    });
  });
});
