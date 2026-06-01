require('dotenv').config();
const express = require('express');
const Log = require('./models/logs');
const { connectDb } = require('./utils/db');
const { sendError } = require('./utils/errors');
const { requestLogger, logEndpointAccess } = require('./utils/requestLogger');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(requestLogger('logs-service'));

app.get('/api/logs', async (req, res) => {
  try {
    await logEndpointAccess('logs-service', '/api/logs');
    const logs = await Log.find({}).sort({ time: 1 }).lean();
    return res.json(logs);
  } catch (err) {
    return sendError(res, 500, 500, 'failed to fetch logs');
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'logs-service' });
});

const { initApp } = require('./app-bootstrap');

async function start() {
  await initApp();
  app.listen(PORT, () => {
    console.log(`logs-service listening on port ${PORT}`);
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
