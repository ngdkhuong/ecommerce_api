const supertest = require('supertest');
const app = require('../app');
const User = require('../src/models/User');
const request = supertest(app);

describe('Authentication', () => {
  beforeAll(async () => {
    await User.deleteMany({});
  });

  it('should sign up a user', async () => {
    const res = await request.post('/api/auth/signup').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should log in a user', async () => {
    const res = await request.post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toEqual(200);
  });

  it('should fail login with wrong credentials', async () => {
    const res = await request.post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'wrongpassword',
    });
    expect(res.statusCode).toEqual(400);
  });
});
