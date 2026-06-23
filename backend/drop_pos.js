require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function clean() {
    try {
        await pool.query('DROP TABLE IF EXISTS pos_order_items CASCADE');
        await pool.query('DROP TABLE IF EXISTS pos_orders CASCADE');
        await pool.query('DROP TABLE IF EXISTS pos_items CASCADE');
        console.log("Cleaned up redundant tables. Using existing food_items schema.");
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
clean();
