const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const app = require('../app');

describe('Auth Integration Tests', () => {
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

  describe('POST /api/auth/login', () => {
    it('should return HTTP 200 OK with a JWT token and user profile for valid credentials', async () => {
      const loginCredentials = {
        email: 'user@dealership.com',
        password: 'Password123!'
      };

      const mockUserDoc = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Test User',
        email: loginCredentials.email,
        role: 'USER',
        password: 'hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(true),
        toObject: function () {
          return {
            _id: this._id,
            name: this.name,
            email: this.email,
            role: this.role
          };
        }
      };

      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockUserDoc)
      };
      jest.spyOn(User, 'findOne').mockReturnValue(mockQuery);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginCredentials);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(loginCredentials.email);
      expect(response.body.data.user).not.toHaveProperty('password');
      expect(mockUserDoc.comparePassword).toHaveBeenCalledWith(loginCredentials.password);
    });

    it('should return HTTP 400 Bad Request when email or password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@dealership.com' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
    });

    it('should return HTTP 401 Unauthorized for non-existent email', async () => {
      const mockQuery = {
        select: jest.fn().mockResolvedValue(null)
      };
      jest.spyOn(User, 'findOne').mockReturnValue(mockQuery);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@dealership.com',
          password: 'Password123!'
        });

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toMatch(/invalid email or password/i);
    });

    it('should return HTTP 401 Unauthorized for incorrect password', async () => {
      const mockUserDoc = {
        _id: new mongoose.Types.ObjectId(),
        email: 'user@dealership.com',
        password: 'hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockUserDoc)
      };
      jest.spyOn(User, 'findOne').mockReturnValue(mockQuery);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@dealership.com',
          password: 'WrongPassword123!'
        });

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toMatch(/invalid email or password/i);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return HTTP 200 OK and current user profile when provided a valid Bearer token', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const validToken = jwt.sign(
        { id: userId, role: 'USER' },
        process.env.JWT_SECRET || 'supersecret_dealership_jwt_key_2026'
      );

      const mockUserDoc = {
        _id: userId,
        name: 'Logged In User',
        email: 'loggedin@dealership.com',
        role: 'USER'
      };

      jest.spyOn(User, 'findById').mockResolvedValueOnce(mockUserDoc);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe('loggedin@dealership.com');
    });

    it('should return HTTP 401 Unauthorized when Authorization header is missing', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toMatch(/not authorized|no token/i);
    });

    it('should return HTTP 401 Unauthorized when provided an invalid Bearer token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_malformed_token_string');

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toMatch(/not authorized|invalid token/i);
    });
  });
});
