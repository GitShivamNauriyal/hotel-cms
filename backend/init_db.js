const { pool } = require('./src/db');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
    console.log("Running migrations...");
    const migrationsDir = path.join(__dirname, 'src', 'migrations');
    const files = fs.readdirSync(migrationsDir).sort();
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        for (const file of files) {
            console.log(`Executing ${file}...`);
            const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
            await client.query(sql);
        }
        await client.query('COMMIT');
        console.log("Migrations applied successfully!");
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Migration failed:", err);
    } finally {
        client.release();
        pool.end();
    }
}
runMigrations();
