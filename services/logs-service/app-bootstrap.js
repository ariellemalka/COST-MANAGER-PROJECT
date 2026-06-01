const { connectDb } = require('./utils/db');

let initialized = false;

async function initApp() {
  if (!initialized) {
    await connectDb();
    initialized = true;
  }
}

module.exports = { initApp };
