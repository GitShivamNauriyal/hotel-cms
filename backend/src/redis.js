const Redis = require('ioredis');
const { env } = require('./config');

const redisClient = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 1,
  showFriendlyErrorStack: true
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

async function testRedisConnection() {
  try {
    await redisClient.ping();
    console.log('✅ Redis connected successfully');
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    process.exit(1);
  }
}

module.exports = {
  redisClient,
  testRedisConnection
};
