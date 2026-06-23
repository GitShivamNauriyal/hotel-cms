require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function runMigration() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log("Creating pos_items table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS pos_items (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                stock_count INT DEFAULT 0,
                image_url TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Creating pos_orders table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS pos_orders (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
                status VARCHAR(50) DEFAULT 'COMPLETED', -- COMPLETED, CANCELLED
                charge_type VARCHAR(50) NOT NULL, -- ROOM, DIRECT
                reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
                total_amount DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Creating pos_order_items table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS pos_order_items (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                pos_order_id UUID NOT NULL REFERENCES pos_orders(id) ON DELETE CASCADE,
                pos_item_id UUID NOT NULL REFERENCES pos_items(id),
                quantity INT NOT NULL,
                price_at_time DECIMAL(10, 2) NOT NULL
            );
        `);

        await client.query('COMMIT');
        console.log("Migration 010 (POS) completed successfully.");
    } catch (e) {
        await client.query('ROLLBACK');
        console.error("Migration failed:", e);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration();
