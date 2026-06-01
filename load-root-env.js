const path = require('path');
const dotenv = require('dotenv');

const ROOT_ENV_PATH = path.join(__dirname, '.env');

function loadRootEnv() {
  return dotenv.config({ path: ROOT_ENV_PATH });
}

module.exports = { loadRootEnv, ROOT_ENV_PATH };
