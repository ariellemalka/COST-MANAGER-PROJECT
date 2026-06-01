/* Starts a local MongoDB instance for development (in-memory). */
const fs = require('fs');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');

const URI_FILE = path.join(__dirname, '..', '.mongo-uri');

async function main() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri('cost_manager');
  fs.writeFileSync(URI_FILE, uri, 'utf8');
  console.log('MongoDB ready:', uri);
  console.log('URI written to', URI_FILE);

  const shutdown = async () => {
    await mongod.stop();
    if (fs.existsSync(URI_FILE)) {
      fs.unlinkSync(URI_FILE);
    }
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
