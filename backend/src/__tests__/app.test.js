const request = require('supertest');
const app = require('../app');

describe('API Server Core Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return 200 OK and health status object', async () => {
      const response = await request(app).get('/api/health');
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('message', 'Car Dealership API is up and running');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/nonexistent-route', () => {
    it('should return 404 Not Found for undefined routes', async () => {
      const response = await request(app).get('/api/nonexistent-route');
      expect(response.statusCode).toEqual(404);
      expect(response.body).toHaveProperty('status', 'fail');
    });
  });
});
