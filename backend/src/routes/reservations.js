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
        await req.db.query(`INSERT INTO folios (reservation_id, organization_id, status) VALUES ($1, $2, 'OPEN')`, [newReservation[0].id, org_id]);

        await req.db.query('COMMIT');
        res.status(201).json(newReservation[0]);

    } catch (error) {
        await req.db.query('ROLLBACK');
        res.status(400).json({ error: error.message });
    }
});

// Create guest
router.post('/guests', async (req, res) => {
    const { full_name, email, phone } = req.body;
    try {
        const { rows } = await req.db.query(
            `INSERT INTO guests (organization_id, full_name, email, phone)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [req.user.organization_id, full_name, email, phone]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const { requireRoot } = require('../middleware/rbac');

// Basic retrieval
router.get('/', async (req, res) => {
    try {
        const { rows } = await req.db.query(`
            SELECT 
                r.*, 
                g.full_name as guest_name, 
                g.email as guest_email, 
                g.phone as guest_phone,
                rm.room_number, 
                rt.name as room_type_name,
                rt.base_price_per_night,
                COALESCE((
                    SELECT SUM(CASE WHEN le.type = 'CHARGE' THEN le.amount WHEN le.type = 'PAYMENT' THEN -le.amount ELSE 0 END)
                    FROM folios f
                    LEFT JOIN ledger_entries le ON f.id = le.folio_id
                    WHERE f.reservation_id = r.id
                ), 0) as ledger_balance
            FROM reservations r
            JOIN guests g ON r.guest_id = g.id
            LEFT JOIN rooms rm ON r.room_id = rm.id
            LEFT JOIN room_types rt ON r.room_type_id = rt.id
            ORDER BY r.check_in_date ASC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete reservation
router.delete('/:id', requireRoot, async (req, res) => {
    try {
        await req.db.query('BEGIN');
        const { rowCount } = await req.db.query(`DELETE FROM reservations WHERE id = $1`, [req.params.id]);
        if (rowCount === 0) {
            await req.db.query('ROLLBACK');
            return res.status(404).json({ error: 'Reservation not found' });
        }
        await req.db.query('COMMIT');
        res.status(204).send();
    } catch (error) {
        await req.db.query('ROLLBACK');
        res.status(400).json({ error: error.message });
    }
});

// Update status (e.g. CHECKED_IN, CHECKED_OUT, CANCELLED)
router.put('/:id/status', async (req, res) => {
    const { status, room_id } = req.body;
    try {
        await req.db.query('BEGIN');

        // If room_id is passed, update it on the reservation
        if (room_id) {
            await req.db.query(`UPDATE reservations SET room_id = $1 WHERE id = $2`, [room_id, req.params.id]);
        }

        const { rows } = await req.db.query(
            `UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *`,
            [status, req.params.id]
        );

        if (rows.length === 0) {
            await req.db.query('ROLLBACK');
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Enforce physical room assignment for CHECKED_IN
        if (status === 'CHECKED_IN' && !rows[0].room_id) {
            await req.db.query('ROLLBACK');
            return res.status(400).json({ error: 'Cannot check-in without a physical room assigned.' });
        }

        // Auto-change room housekeeping status
        if (status === 'CHECKED_IN' && rows[0].room_id) {
            await req.db.query(
                `UPDATE rooms SET housekeeping_status = 'OCCUPIED' WHERE id = $1`,
                [rows[0].room_id]
            );
        } else if (status === 'CHECKED_OUT' && rows[0].room_id) {
            await req.db.query(
                `UPDATE rooms SET housekeeping_status = 'DIRTY' WHERE id = $1`,
                [rows[0].room_id]
            );
        }

        await req.db.query('COMMIT');
        res.json(rows[0]);
    } catch (error) {
        await req.db.query('ROLLBACK');
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
