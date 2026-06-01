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
  const User = require('../models/users');
  await User.create({
    id: 123123,
    first_name: 'mosh',
    last_name: 'israeli',
    birthday: new Date('1990-01-01')
  });
});

after(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('costs-service', () => {
  it('rejects negative sum with specific message', async () => {
    const res = await request(app)
      .post('/api/add')
      .send({ userid: 123123, description: 'x', category: 'food', sum: -1 });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.message, 'cost cannot be negative number');
  });

  it('adds cost and builds report', async () => {
    const add = await request(app)
      .post('/api/add')
      .send({ userid: 123123, description: 'milk', category: 'food', sum: 8 });
    assert.strictEqual(add.status, 201);
    const now = new Date();
    const res = await request(app).get('/api/report').query({
      id: 123123,
      year: now.getFullYear(),
      month: now.getMonth() + 1
    });
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.costs));
  });
});
