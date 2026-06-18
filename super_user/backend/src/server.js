const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');
require('dotenv').config();

const { testDbConnection } = require('./db');

const authRoutes = require('./routes/auth');
const superuserRoutes = require('./routes/superuser');

const app = express();

// Basic middleware
app.use(helmet());
app.use(cors({ origin: '*' })); // Restrict in production

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, 
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);
app.use(express.json());

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/super', superuserRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString(), service: 'control-plane' });
});

async function bootstrap() {
  console.log("Starting Control Plane diagnostics...");
  
  // Test Database Connection
  await testDbConnection();
  
  const port = process.env.PORT || 4001;
  app.listen(port, () => {
    console.log(`🚀 Control Plane API running on port ${port}`);
  });
}

bootstrap().catch(err => {
  console.error("Fatal boot error:", err);
  process.exit(1);
});
