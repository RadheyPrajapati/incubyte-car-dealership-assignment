const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Requiring the User model which does not exist yet (TDD RED Phase)
const User = require('../models/userModel');

describe('User Model Unit Tests (TDD - Red Phase)', () => {
  describe('User Validation & Role Defaulting', () => {
    it('should validate a complete user object and set default role to USER', () => {
      const userData = {
        name: 'Test Driver',
        email: 'driver@dealership.com',
        password: 'SecurePassword123!'
      };
      
      const user = new User(userData);
      const err = user.validateSync();

      expect(err).toBeUndefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe('USER');
    });

    it('should require email, password, and name fields', () => {
      const user = new User({});
      const err = user.validateSync();

      expect(err).toBeDefined();
      expect(err.errors.name).toBeDefined();
      expect(err.errors.email).toBeDefined();
      expect(err.errors.password).toBeDefined();
    });

    it('should reject invalid email formats', () => {
      const user = new User({
        name: 'Invalid Email User',
        email: 'not-an-email',
        password: 'password123'
      });
      
      const err = user.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.email).toBeDefined();
    });
  });

  describe('Password Hashing Pre-Save Hook & Helper Methods', () => {
    it('should automatically hash plain text password before saving', async () => {
      const plainPassword = 'plainSecretPassword123';
      const user = new User({
        name: 'Security User',
        email: 'security@dealership.com',
        password: plainPassword
      });

      // Execute pre-save middleware / hashing function on user document
      if (typeof user.hashPassword === 'function') {
        await user.hashPassword();
      }

      expect(user.password).not.toBe(plainPassword);
      const isMatch = await bcrypt.compare(plainPassword, user.password);
      expect(isMatch).toBe(true);
    });

    it('should provide instance method comparePassword to verify password', async () => {
      const user = new User({
        name: 'Method User',
        email: 'method@dealership.com',
        password: 'MyPassword123!'
      });

      expect(typeof user.comparePassword).toBe('function');
      const isMatched = await user.comparePassword('MyPassword123!');
      expect(isMatched).toBe(true);
    });
  });
});
