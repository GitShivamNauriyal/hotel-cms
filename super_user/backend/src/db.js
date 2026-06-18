const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testDbConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log("✅ PostgreSQL connected successfully (Super User Control Plane)");
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err);
    process.exit(1);
  }
}

module.exports = {
  pool,
  testDbConnection
};
