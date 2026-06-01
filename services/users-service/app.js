require('dotenv').config();
const express = require('express');
const User = require('./models/users');
const Cost = require('./models/costs');
const { connectDb } = require('./utils/db');
const { sendError } = require('./utils/errors');
const { requestLogger, logEndpointAccess } = require('./utils/requestLogger');
const { validateAddUser } = require('./utils/validateUser');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(requestLogger('users-service'));

app.get('/api/users', async (req, res) => {
  try {
    await logEndpointAccess('users-service', '/api/users');
    const users = await User.find({}).lean();
    return res.json(users);
  } catch (err) {
    return sendError(res, 500, 500, 'failed to list users');
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    await logEndpointAccess('users-service', '/api/users/:id');
    const userId = Number(req.params.id);
    if (Number.isNaN(userId)) {
      return sendError(res, 400, 7, 'id must be a number');
    }

    const user = await User.findOne({ id: userId }).lean();
    if (!user) {
      return sendError(res, 404, 8, `user with id ${userId} does not exist`);
    }

    const costs = await Cost.find({ userid: userId }).lean();
    const total = costs.reduce((sum, item) => sum + item.sum, 0);

    return res.json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      total
    });
  } catch (err) {
    return sendError(res, 500, 500, 'failed to get user details');
  }
});

app.post(['/api/add', '/api/add/'], async (req, res) => {
  try {
    await logEndpointAccess('users-service', '/api/add');
    const validationError = validateAddUser(req.body);
    if (validationError) {
      return sendError(res, 400, validationError.id, validationError.message);
    }

    const existing = await User.findOne({ id: Number(req.body.id) });
    if (existing) {
      return sendError(res, 409, 9, `user with id ${req.body.id} already exists`);
    }

    const user = await User.create({
      id: Number(req.body.id),
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      birthday: new Date(req.body.birthday)
    });

    return res.status(201).json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      birthday: user.birthday
    });
  } catch (err) {
    return sendError(res, 500, 500, 'failed to add user');
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'users-service' });
});

const { initApp } = require('./app-bootstrap');

async function start() {
  await initApp();
  app.listen(PORT, () => {
    console.log(`users-service listening on port ${PORT}`);
  });
}

if (require.main === module) {
  start().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = app;
module.exports.initApp = require('./app-bootstrap').initApp;
