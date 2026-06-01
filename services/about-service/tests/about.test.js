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

describe('about-service', () => {
  it('returns team on /api/about/', async () => {
    const res = await request(app).get('/api/about/');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body[0].first_name);
  });
});
