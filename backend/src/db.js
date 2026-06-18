const { Pool } = require('pg');
const { env } = require('./config');

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20, // max connection pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
  process.exit(-1);
});

async function testDbConnection() {
  const client = await pool.connect();
  try {
    await client.query('SELECT NOW() as time');
    console.log('✅ PostgreSQL connected successfully');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    process.exit(1);
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  testDbConnection
};
