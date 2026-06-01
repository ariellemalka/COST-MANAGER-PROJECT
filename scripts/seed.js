/* Seeds the imaginary submission user (id 123123). */
const { loadRootEnv } = require('../load-root-env');
loadRootEnv();
const mongoose = require('mongoose');
const { getMongoUri } = require('./get-mongo-uri');

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  birthday: { type: Date, required: true }
});

async function main() {
  const uri = getMongoUri();
  await mongoose.connect(uri);
  const User = mongoose.model('users', userSchema);

  await User.deleteMany({});
  await User.create({
    id: 123123,
    first_name: 'mosh',
    last_name: 'israeli',
    birthday: new Date('1990-01-01')
  });

  console.log('Seeded user 123123 (mosh israeli)');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
