/* Starts all four microservices (requires MongoDB URI). */
const { spawn } = require('child_process');
const path = require('path');
const { getMongoUri } = require('./get-mongo-uri');

const services = [
  { name: 'logs', dir: 'logs-service', port: process.env.LOGS_PORT || 3001 },
  { name: 'users', dir: 'users-service', port: process.env.USERS_PORT || 3002 },
  { name: 'costs', dir: 'costs-service', port: process.env.COSTS_PORT || 3003 },
  { name: 'about', dir: 'about-service', port: process.env.ABOUT_PORT || 3004 }
];

const mongoUri = getMongoUri();
const children = [];

function startService(service) {
  const cwd = path.join(__dirname, '..', 'services', service.dir);
  const child = spawn('node', ['app.js'], {
    cwd,
    env: {
      ...process.env,
      MONGODB_URI: mongoUri,
      PORT: String(service.port)
    },
    stdio: 'inherit'
  });
  children.push(child);
  console.log(`Started ${service.name} on port ${service.port}`);
}

services.forEach(startService);

function shutdown() {
  children.forEach((c) => c.kill('SIGTERM'));
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
