const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

// Import config first to validate environment before anything else
const { env } = require('./config');
const { testDbConnection } = require('./db');
const { testRedisConnection } = require('./redis');

const authRoutes = require('./routes/auth');
const { releaseDbClient } = require('./middleware/auth');

const app = express();

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Global cleanup
app.use(releaseDbClient);

// Mount routes
app.use('/api/v1/auth', authRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function bootstrap() {
  console.log("Starting boot diagnostics...");
  
  // Test Database Connection
  await testDbConnection();
  
  // Test Redis Connection
  await testRedisConnection();
  
  const port = env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Stateless Node.js API Cluster running on port ${port}`);
  });
}

bootstrap().catch(err => {
  console.error("Fatal boot error:", err);
  process.exit(1);
});
