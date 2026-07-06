import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import app from './app.js';

const startServer = async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`Parentsphere API running on http://localhost:${env.port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
