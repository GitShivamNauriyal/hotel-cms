const express = require('express');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

const VALID_TRANSITIONS = {
    'AVAILABLE': ['OCCUPIED', 'DIRTY', 'MAINTENANCE'],
    'OCCUPIED': ['DIRTY', 'DUE_OUT'],
    'DUE_OUT': ['DIRTY'],
    'DIRTY': ['AVAILABLE', 'MAINTENANCE'],
    'MAINTENANCE': ['AVAILABLE', 'DIRTY']
};

/**
 * State Machine Transition logic for Housekeeping Status
 */
router.post('/:roomId/transition', async (req, res) => {
    const { roomId } = req.params;
    const { new_status } = req.body;

    try {
        await req.db.query('BEGIN');

        // Lock the room row to ensure atomic transition
        const { rows: roomRows } = await req.db.query(
            `SELECT housekeeping_status FROM rooms WHERE id = $1 FOR UPDATE`,
            [roomId]
        );

        if (roomRows.length === 0) {
            await req.db.query('ROLLBACK');
            return res.status(404).json({ error: 'Room not found' });
        }

        const currentStatus = roomRows[0].housekeeping_status;

        // Validate transition
        if (!VALID_TRANSITIONS[currentStatus]?.includes(new_status)) {
            await req.db.query('ROLLBACK');
            return res.status(400).json({ 
                error: `Invalid state transition from ${currentStatus} to ${new_status}` 
            });
        }

        // Apply transition
        const { rows: updatedRoom } = await req.db.query(
            `UPDATE rooms SET housekeeping_status = $1 WHERE id = $2 RETURNING *`,
            [new_status, roomId]
        );

        await req.db.query('COMMIT');
        res.json(updatedRoom[0]);

    } catch (error) {
        await req.db.query('ROLLBACK');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
