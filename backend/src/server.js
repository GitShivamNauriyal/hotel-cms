const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

// Import config first to validate environment before anything else
const { env } = require('./config');
const { testDbConnection } = require('./db');
const { testRedisConnection } = require('./redis');

const authRoutes = require('./routes/auth');
const configRoutes = require('./routes/config');
const { releaseDbClient } = require('./middleware/auth');

const app = express();

// Basic middleware
app.use(helmet());
app.use(cors({ origin: '*' })); // Restrict in production

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, 
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

app.use(express.json());

// Global cleanup
app.use(releaseDbClient);

const reservationsRoutes = require('./routes/reservations');
const housekeepingRoutes = require('./routes/housekeeping');
const financeRoutes = require('./routes/finance');

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/config', configRoutes);
app.use('/api/v1/reservations', reservationsRoutes);
app.use('/api/v1/housekeeping', housekeepingRoutes);
app.use('/api/v1/finance', financeRoutes);

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
