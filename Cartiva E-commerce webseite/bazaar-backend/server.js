// import 'dotenv/config';
// import app from './src/app.js';
// import connectDB from './src/config/db.js';

// const PORT = process.env.PORT || 5000;

// async function start() {
//   await connectDB();
//   app.listen(PORT, () => {
//     console.log(`Bazaar API listening on http://localhost:${PORT}`);
//   });
// }

// start();

// process.on('unhandledRejection', (err) => {
//   console.error('Unhandled rejection:', err);
//   process.exit(1);
// });

import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Bazaar API listening on http://localhost:${PORT}`);
  });
}

start();

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});