const mongoose = require('mongoose');

/*
 * Computed design pattern: cached monthly reports for past months.
 * Each document stores the pre-built report JSON for a user/year/month.
 */
const reportsSchema = new mongoose.Schema({
  userid: { type: Number, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  report: { type: mongoose.Schema.Types.Mixed, required: true }
});

reportsSchema.index({ userid: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('reports', reportsSchema);
