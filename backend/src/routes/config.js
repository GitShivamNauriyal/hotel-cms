const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { requireRoot } = require('../middleware/rbac');

const router = express.Router();

// Apply auth to all routes in this router
router.use(requireAuth);

/**
 * Note: `req.db` is the acquired client with RLS already configured.
 * We must use `req.db` instead of the global pool to maintain tenant isolation context.
 */

// --- ROOM TYPES ---
router.get('/room-types', async (req, res) => {
    try {
        const { rows } = await req.db.query(`SELECT * FROM room_types ORDER BY created_at DESC`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Write operations restricted to Root Users
router.post('/room-types', requireRoot, async (req, res) => {
    const { name, base_price_per_night, max_occupancy, amenities } = req.body;
    try {
        const { rows } = await req.db.query(
            `INSERT INTO room_types (organization_id, name, base_price_per_night, max_occupancy, amenities)
             VALUES (current_setting('app.current_organization_id', true)::uuid, $1, $2, $3, $4)
             RETURNING *`,
            [name, base_price_per_night, max_occupancy, JSON.stringify(amenities || [])]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/room-types/:id', requireRoot, async (req, res) => {
    try {
        await req.db.query(`DELETE FROM room_types WHERE id = $1`, [req.params.id]);
        res.status(204).send();
    } catch (error) {
        // This will catch foreign key constraint violations from rooms
        if (error.code === '23503') {
            return res.status(409).json({ error: 'Cannot delete room type: there are rooms currently assigned to it.' });
        }
        res.status(400).json({ error: error.message });
    }
});

// --- ROOMS ---
router.get('/rooms', async (req, res) => {
    try {
        const { rows } = await req.db.query(`
            SELECT r.*, rt.name as room_type_name
            FROM rooms r
            JOIN room_types rt ON r.room_type_id = rt.id
            ORDER BY r.room_number ASC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/rooms', requireRoot, async (req, res) => {
    const { room_type_id, room_number } = req.body;
    try {
        const { rows } = await req.db.query(
            `INSERT INTO rooms (organization_id, room_type_id, room_number)
             VALUES (current_setting('app.current_organization_id', true)::uuid, $1, $2)
             RETURNING *`,
            [room_type_id, room_number]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Room number already exists in this property.' });
        }
        res.status(400).json({ error: error.message });
    }
});

router.put('/room-types/:id', requireRoot, async (req, res) => {
    const { name, base_price_per_night, max_occupancy, amenities } = req.body;
    try {
        const { rows } = await req.db.query(
            `UPDATE room_types 
             SET name = $1, base_price_per_night = $2, max_occupancy = $3, amenities = $4
             WHERE id = $5
             RETURNING *`,
            [name, base_price_per_night, max_occupancy, JSON.stringify(amenities || []), req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Room type not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/rooms/:id', requireRoot, async (req, res) => {
    const { room_type_id, room_number } = req.body;
    try {
        const { rows } = await req.db.query(
            `UPDATE rooms 
             SET room_type_id = $1, room_number = $2
             WHERE id = $3
             RETURNING *`,
            [room_type_id, room_number, req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Room not found' });
        res.json(rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Room number already exists in this property.' });
        }
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
