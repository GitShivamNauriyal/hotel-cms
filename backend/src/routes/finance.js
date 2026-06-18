const express = require('express');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

/**
 * Get Folio and Dynamically Calculate Balance
 */
router.get('/folios/:reservationId', async (req, res) => {
    try {
        const { rows: folios } = await req.db.query(
            `SELECT * FROM folios WHERE reservation_id = $1`,
            [req.params.reservationId]
        );

        if (folios.length === 0) {
            return res.status(404).json({ error: 'Folio not found' });
        }

        const folio = folios[0];

        const { rows: ledger } = await req.db.query(
            `SELECT type, SUM(amount) as total 
             FROM ledger_entries 
             WHERE folio_id = $1 
             GROUP BY type`,
            [folio.id]
        );

        let balance = 0;
        const entries = [];
        ledger.forEach(entry => {
            const total = parseFloat(entry.total);
            if (entry.type === 'CHARGE') balance += total;
            if (entry.type === 'PAYMENT') balance -= total;
            if (entry.type === 'REFUND') balance += total;
            entries.push(entry);
        });

        res.json({
            ...folio,
            balance: balance.toFixed(2),
            summary: entries
        });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Post a Charge or Payment
 */
router.post('/folios/:folioId/entries', async (req, res) => {
    const { type, amount, description } = req.body;
    const org_id = req.user.organization_id;

    if (!['CHARGE', 'PAYMENT', 'REFUND'].includes(type)) {
        return res.status(400).json({ error: 'Invalid entry type' });
    }

    try {
        await req.db.query('BEGIN');

        // Lock folio to prevent race conditions during payment processing
        const { rows: folios } = await req.db.query(
            `SELECT status FROM folios WHERE id = $1 AND organization_id = $2 FOR UPDATE`,
            [req.params.folioId, org_id]
        );

        if (folios.length === 0) {
            await req.db.query('ROLLBACK');
            return res.status(404).json({ error: 'Folio not found' });
        }

        if (folios[0].status === 'SETTLED' && type !== 'REFUND') {
            await req.db.query('ROLLBACK');
            return res.status(400).json({ error: 'Cannot post charges to a settled folio' });
        }

        const { rows: newEntry } = await req.db.query(
            `INSERT INTO ledger_entries (folio_id, organization_id, type, amount, description)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [req.params.folioId, org_id, type, amount, description]
        );

        // If Payment, check balance to auto-settle
        if (type === 'PAYMENT') {
            const { rows: ledger } = await req.db.query(
                `SELECT type, SUM(amount) as total FROM ledger_entries WHERE folio_id = $1 GROUP BY type`,
                [req.params.folioId]
            );
            
            let balance = 0;
            ledger.forEach(entry => {
                const total = parseFloat(entry.total);
                if (entry.type === 'CHARGE') balance += total;
                if (entry.type === 'PAYMENT') balance -= total;
            });

            if (balance <= 0) {
                await req.db.query(
                    `UPDATE folios SET status = 'SETTLED' WHERE id = $1`,
                    [req.params.folioId]
                );
            }
        }

        await req.db.query('COMMIT');
        res.status(201).json(newEntry[0]);

    } catch (error) {
        await req.db.query('ROLLBACK');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
