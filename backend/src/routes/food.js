const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { requireRoot } = require('../middleware/rbac');

const router = express.Router();
router.use(requireAuth);

// --- FOOD ITEMS ---

// Get all food items
router.get('/items', async (req, res) => {
    try {
        const { rows } = await req.db.query(
            `SELECT * FROM food_items WHERE is_available = true ORDER BY category, name ASC`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Root: Add food item
router.post('/items', requireRoot, async (req, res) => {
    const { name, description, category, price, is_available } = req.body;
    try {
        const { rows } = await req.db.query(
            `INSERT INTO food_items (organization_id, name, description, category, price, is_available)
             VALUES (current_setting('app.current_organization_id', true)::uuid, $1, $2, $3, $4, $5)
             RETURNING *`,
            [name, description, category || 'GENERAL', price, is_available ?? true]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Root: Edit food item
router.put('/items/:id', requireRoot, async (req, res) => {
    const { name, description, category, price, is_available } = req.body;
    try {
        const { rows } = await req.db.query(
            `UPDATE food_items 
             SET name = $1, description = $2, category = $3, price = $4, is_available = $5
             WHERE id = $6
             RETURNING *`,
            [name, description, category, price, is_available, req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Food item not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// --- FOOD ORDERS ---

// Get all orders (with items)
router.get('/orders', async (req, res) => {
    try {
        const { rows: orders } = await req.db.query(`
            SELECT o.*, r.room_id, r.guest_id, g.full_name as guest_name, rm.room_number
            FROM food_orders o
            LEFT JOIN reservations r ON o.reservation_id = r.id
            LEFT JOIN guests g ON r.guest_id = g.id
            LEFT JOIN rooms rm ON r.room_id = rm.id
            ORDER BY o.created_at DESC
        `);

        // Fetch items for these orders
        if (orders.length > 0) {
            const orderIds = orders.map(o => o.id);
            const { rows: items } = await req.db.query(`
                SELECT i.*, f.name, f.category
                FROM food_order_items i
                JOIN food_items f ON i.food_item_id = f.id
                WHERE i.order_id = ANY($1)
            `, [orderIds]);

            // Group items by order
            orders.forEach(order => {
                order.items = items.filter(i => i.order_id === order.id);
            });
        }

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Place new order
router.post('/orders', async (req, res) => {
    const { reservation_id, folio_id, items } = req.body; 
    // items should be array of { food_item_id, quantity }
    const org_id = req.user.organization_id;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Order must contain items' });
    }

    try {
        await req.db.query('BEGIN');

        // Verify items and calculate total
        let total_amount = 0;
        const processedItems = [];

        for (const item of items) {
            const { rows: foodRows } = await req.db.query(
                `SELECT price FROM food_items WHERE id = $1 AND organization_id = $2`,
                [item.food_item_id, org_id]
            );
            
            if (foodRows.length === 0) {
                throw new Error(`Food item ${item.food_item_id} not found`);
            }

            const unit_price = parseFloat(foodRows[0].price);
            const subtotal = unit_price * item.quantity;
            total_amount += subtotal;

            processedItems.push({
                food_item_id: item.food_item_id,
                quantity: item.quantity,
                unit_price,
                subtotal
            });
        }

        // Create Order
        const { rows: orderRows } = await req.db.query(
            `INSERT INTO food_orders (organization_id, reservation_id, folio_id, status, total_amount)
             VALUES ($1, $2, $3, 'PENDING', $4) RETURNING *`,
            [org_id, reservation_id || null, folio_id || null, total_amount]
        );

        const newOrderId = orderRows[0].id;

        // Create Order Items
        for (const item of processedItems) {
            await req.db.query(
                `INSERT INTO food_order_items (order_id, food_item_id, quantity, unit_price, subtotal)
                 VALUES ($1, $2, $3, $4, $5)`,
                [newOrderId, item.food_item_id, item.quantity, item.unit_price, item.subtotal]
            );
        }

        // If there's a folio_id, automatically charge the ledger!
        if (folio_id) {
            // Lock folio to prevent race conditions during payment processing
            const { rows: folios } = await req.db.query(
                `SELECT status FROM folios WHERE id = $1 AND organization_id = $2 FOR UPDATE`,
                [folio_id, org_id]
            );

            if (folios.length > 0 && folios[0].status !== 'SETTLED') {
                await req.db.query(
                    `INSERT INTO ledger_entries (folio_id, organization_id, type, amount, description)
                     VALUES ($1, $2, 'CHARGE', $3, $4)`,
                    [folio_id, org_id, total_amount, `Food & Beverage Order #${newOrderId.split('-')[0]}`]
                );
            }
        }

        await req.db.query('COMMIT');
        res.status(201).json(orderRows[0]);
    } catch (error) {
        await req.db.query('ROLLBACK');
        res.status(400).json({ error: error.message });
    }
});

// Update order status (e.g. mark as DELIVERED)
router.put('/orders/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        const { rows } = await req.db.query(
            `UPDATE food_orders SET status = $1 WHERE id = $2 RETURNING *`,
            [status, req.params.id]
        );
        res.json(rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
