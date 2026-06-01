const pino = require('pino');
const Log = require('../models/logs');

const logger = pino({ level: 'info' });

async function saveLog(entry) {
  try {
    await Log.create(entry);
  } catch (err) {
    logger.error({ err }, 'failed to save log to database');
  }
}

function requestLogger(serviceName) {
  return function logMiddleware(req, res, next) {
    const base = {
      level: 'info',
      method: req.method,
      url: req.originalUrl,
      time: new Date()
    };

    saveLog({
      ...base,
      message: `HTTP request received on ${serviceName}`,
      endpoint: req.path
    });

    res.on('finish', () => {
      saveLog({
        ...base,
        message: `HTTP response ${res.statusCode} on ${serviceName}`,
        endpoint: req.path
      });
    });

    next();
  };
}

function logEndpointAccess(serviceName, endpointName) {
  return saveLog({
    level: 'info',
    message: `Endpoint accessed: ${endpointName}`,
    endpoint: endpointName,
    time: new Date()
  });
}

module.exports = { requestLogger, logEndpointAccess, logger };
