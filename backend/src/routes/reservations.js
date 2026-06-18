const express = require('express');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

/**
 * Atomic Reservation Creation Engine.
 * Requirements: Strict check for overlapping reservations if room_id is specified.
 */
router.post('/', async (req, res) => {
    const { guest_id, room_type_id, room_id, check_in_date, check_out_date, source } = req.body;

    const org_id = req.user.organization_id;

    try {
        await req.db.query('BEGIN');

        if (room_id) {
            // Strictly check for overlaps using FOR UPDATE to prevent race conditions.
            // We lock the room row first to serialize booking attempts for this specific physical room.
            await req.db.query(
                `SELECT id FROM rooms WHERE id = $1 AND organization_id = $2 FOR UPDATE`,
                [room_id, org_id]
            );

            const { rows: overlaps } = await req.db.query(
                `SELECT id FROM reservations 
                 WHERE room_id = $1 
                 AND status != 'CANCELLED'
                 AND organization_id = $2
                 AND (check_in_date < $4 AND check_out_date > $3)`,
                [room_id, org_id, check_in_date, check_out_date]
            );

            if (overlaps.length > 0) {
                await req.db.query('ROLLBACK');
                return res.status(409).json({ error: 'Room is already booked for the specified dates.' });
            }
        }

        const { rows: newReservation } = await req.db.query(
            `INSERT INTO reservations (organization_id, guest_id, room_type_id, room_id, check_in_date, check_out_date, source)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [org_id, guest_id, room_type_id, room_id || null, check_in_date, check_out_date, source || 'DIRECT']
        );

        // In Phase 4, we would initialize the financial folio here.
        // await req.db.query(`INSERT INTO folios (reservation_id, status) VALUES ($1, 'OPEN')`, [newReservation[0].id]);

        await req.db.query('COMMIT');
        res.status(201).json(newReservation[0]);

    } catch (error) {
        await req.db.query('ROLLBACK');
        res.status(400).json({ error: error.message });
    }
});

// Basic retrieval
router.get('/', async (req, res) => {
    try {
        const { rows } = await req.db.query(`
            SELECT r.*, g.full_name as guest_name, rm.room_number 
            FROM reservations r
            JOIN guests g ON r.guest_id = g.id
            LEFT JOIN rooms rm ON r.room_id = rm.id
            ORDER BY r.check_in_date ASC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
