const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;
let app;

before(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri('cost_manager');
  mongoose.models = {};
  mongoose.modelSchemas = {};
  delete require.cache[require.resolve('../app')];
  const mod = require('../app');
  await mod.initApp();
  app = mod;
});

after(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('users-service', () => {
  it('rejects missing birthday with specific message', async () => {
    const res = await request(app)
      .post('/api/add')
      .send({ id: 1, first_name: 'a', last_name: 'b' });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.message, 'birthday is required');
  });

  it('adds and fetches user', async () => {
    await request(app).post('/api/add').send({
      id: 99,
      first_name: 'test',
      last_name: 'user',
      birthday: '2000-05-05'
    });
    const res = await request(app).get('/api/users/99');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.first_name, 'test');
  });
});
