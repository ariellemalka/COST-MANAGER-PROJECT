const mongoose = require('mongoose');

const logsSchema = new mongoose.Schema({
  level: { type: String, required: true },
  message: { type: String, required: true },
  method: { type: String },
  url: { type: String },
  endpoint: { type: String },
  time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('logs', logsSchema);
