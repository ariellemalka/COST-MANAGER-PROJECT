require('dotenv').config();
const express = require('express');
const User = require('./models/users');
const Cost = require('./models/costs');
const Report = require('./models/reports');
const { connectDb } = require('./utils/db');
const { sendError } = require('./utils/errors');
const { requestLogger, logEndpointAccess } = require('./utils/requestLogger');
const { validateAddCost, validateReportQuery } = require('./utils/validateCost');
const { buildReport, isPastMonth } = require('./utils/reportBuilder');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use(requestLogger('costs-service'));

app.post(['/api/add', '/api/add/'], async (req, res) => {
  try {
    await logEndpointAccess('costs-service', '/api/add');
    const validationError = validateAddCost(req.body);
    if (validationError) {
      return sendError(res, 400, validationError.id, validationError.message);
    }

    const userId = Number(req.body.userid);
    const user = await User.findOne({ id: userId });
    if (!user) {
      return sendError(res, 404, 26, `user with id ${userId} does not exist`);
    }

    const createdAt = req.body.created_at ? new Date(req.body.created_at) : new Date();
    const cost = await Cost.create({
      description: req.body.description,
      category: req.body.category,
      userid: userId,
      sum: Number(req.body.sum),
      created_at: createdAt
    });

    return res.status(201).json({
      description: cost.description,
      category: cost.category,
      userid: cost.userid,
      sum: cost.sum,
      created_at: cost.created_at
    });
  } catch (err) {
    return sendError(res, 500, 500, 'failed to add cost item');
  }
});

app.get('/api/report', async (req, res) => {
  try {
    await logEndpointAccess('costs-service', '/api/report');
    const validationError = validateReportQuery(req.query);
    if (validationError) {
      return sendError(res, 400, validationError.id, validationError.message);
    }

    const userId = Number(req.query.id);
    const year = Number(req.query.year);
    const month = Number(req.query.month);

    const user = await User.findOne({ id: userId });
    if (!user) {
      return sendError(res, 404, 27, `user with id ${userId} does not exist`);
    }

    // Computed pattern: return cached report for past months when available.
    if (isPastMonth(year, month)) {
      const cached = await Report.findOne({ userid: userId, year, month }).lean();
      if (cached && cached.report) {
        return res.json(cached.report);
      }
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    const costs = await Cost.find({
      userid: userId,
      created_at: { $gte: start, $lt: end }
    }).lean();

    const report = buildReport(userId, year, month, costs);

    if (isPastMonth(year, month)) {
      await Report.findOneAndUpdate(
        { userid: userId, year, month },
        { report },
        { upsert: true, new: true }
      );
    }

    return res.json(report);
  } catch (err) {
    return sendError(res, 500, 500, 'failed to generate report');
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'costs-service' });
});

const { initApp } = require('./app-bootstrap');

async function start() {
  await initApp();
  app.listen(PORT, () => {
    console.log(`costs-service listening on port ${PORT}`);
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
