const fs = require('fs');
const path = require('path');

function getMongoUri() {
  const file = path.join(__dirname, '..', '.mongo-uri');
  if (fs.existsSync(file)) {
    return fs.readFileSync(file, 'utf8').trim();
  }
  return process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cost_manager';
}

module.exports = { getMongoUri };
