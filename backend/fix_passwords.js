const { pool } = require('./src/db');
const bcrypt = require('bcrypt');

async function fix() {
    const hash = await bcrypt.hash('password123', 10);
    console.log("New hash:", hash);
    const client = await pool.connect();
    try {
        await client.query("UPDATE users SET password_hash = $1", [hash]);
        console.log("Updated all passwords.");
    } catch(err) {
        console.error(err);
    } finally {
        client.release();
        pool.end();
    }
}
fix();
