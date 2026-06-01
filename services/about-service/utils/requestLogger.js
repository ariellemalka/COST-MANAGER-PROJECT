const pino = require('pino');
const Log = require('../models/logs');

const logger = pino({ level: 'info' });

async function saveLog(entry) {
  try {
    await Log.create(entry);
  } catch (err) {
    logger.error({ err }, 'failed to save log');
  }
}

function requestLogger(serviceName) {
  return function logMiddleware(req, res, next) {
    saveLog({
      level: 'info',
      message: `HTTP request received on ${serviceName}`,
      method: req.method,
      url: req.originalUrl,
      endpoint: req.path,
      time: new Date()
    });
    next();
  };
}

async function logEndpointAccess(serviceName, endpointName) {
  await saveLog({
    level: 'info',
    message: `Endpoint accessed: ${endpointName} on ${serviceName}`,
    endpoint: endpointName,
    time: new Date()
  });
}

module.exports = { requestLogger, logEndpointAccess };
