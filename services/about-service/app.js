require('dotenv').config();
const express = require('express');
const { connectDb } = require('./utils/db');
const { sendError } = require('./utils/errors');
const { requestLogger, logEndpointAccess } = require('./utils/requestLogger');
const { getTeamMembers } = require('./utils/team');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());
app.use(requestLogger('about-service'));

async function aboutHandler(req, res) {
  try {
    await logEndpointAccess('about-service', '/api/about');
    const team = getTeamMembers();
    if (!team) {
      return sendError(res, 500, 28, 'team members configuration is invalid');
    }
    return res.json(team);
  } catch (err) {
    return sendError(res, 500, 500, 'failed to get team details');
  }
}

app.get(['/api/about', '/api/about/'], aboutHandler);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'about-service' });
});

const { initApp } = require('./app-bootstrap');

async function start() {
  await initApp();
  app.listen(PORT, () => {
    console.log(`about-service listening on port ${PORT}`);
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
