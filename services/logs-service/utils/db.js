const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

function resolveMongoUri() {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }
  const file = path.join(__dirname, '..', '..', '..', '.mongo-uri');
  if (fs.existsSync(file)) {
    return fs.readFileSync(file, 'utf8').trim();
  }
  return 'mongodb://127.0.0.1:27017/cost_manager';
}

async function connectDb() {
  const uri = resolveMongoUri();
  await mongoose.connect(uri);
  return uri;
}

module.exports = { connectDb, resolveMongoUri };
