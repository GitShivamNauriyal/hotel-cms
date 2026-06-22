const { pool } = require('./src/db');
const fs = require('fs');
const path = require('path');

async function run() {
    console.log("Running migration 009...");
    const sql = fs.readFileSync(path.join(__dirname, 'src', 'migrations', '009_staff_management.sql'), 'utf8');
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('COMMIT');
        console.log("Migration 009 applied successfully!");
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Migration failed:", err);
    } finally {
        client.release();
        pool.end();
    }
}

run();
