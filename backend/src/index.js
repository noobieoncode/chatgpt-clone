const mongoose = require('mongoose');
const app = require('./app');
const env = require('./config/env');

async function start() {
  await mongoose.connect(env.mongoUri);
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${env.port}`);
  });
}

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', error);
  process.exit(1);
});
