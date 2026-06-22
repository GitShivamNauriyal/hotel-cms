const express = require('express');
const bcrypt = require('bcrypt');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Middleware to ensure user is Root
const requireRoot = (req, res, next) => {
    if (!req.user.is_root) {
        return res.status(403).json({ error: 'Forbidden: Root access required' });
    }
    next();
};

// GET /api/v1/staff - List all staff
router.get('/', requireAuth, requireRoot, async (req, res) => {
    try {
        const { rows } = await req.db.query(`
            SELECT id, email, full_name, staff_category, created_at
            FROM users
            WHERE organization_id = $1 AND is_root = false AND deleted_at IS NULL
            ORDER BY created_at DESC
        `, [req.user.organization_id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch staff' });
    }
});

// POST /api/v1/staff - Add new staff
router.post('/', requireAuth, requireRoot, async (req, res) => {
    const { email, password, full_name, staff_category, root_password } = req.body;
    
    if (!email || !password || !full_name || !staff_category || !root_password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await req.db.query('BEGIN');
        
        // 1. Verify root password
        const rootUser = await req.db.query('SELECT password_hash FROM users WHERE id = $1', [req.user.user_id]);
        if (rootUser.rows.length === 0) throw new Error('Root user not found');
        
        const isMatch = await bcrypt.compare(root_password, rootUser.rows[0].password_hash);
        if (!isMatch) {
            await req.db.query('ROLLBACK');
            return res.status(401).json({ error: 'Invalid root password' });
        }

        // 2. Insert new staff
        const password_hash = await bcrypt.hash(password, 10);
        const { rows } = await req.db.query(`
            INSERT INTO users (organization_id, email, password_hash, full_name, staff_category, is_root)
            VALUES ($1, $2, $3, $4, $5, false)
            RETURNING id, email, full_name, staff_category, created_at
        `, [req.user.organization_id, email, password_hash, full_name, staff_category]);
        
        await req.db.query('COMMIT');
        res.status(201).json(rows[0]);
    } catch (error) {
        await req.db.query('ROLLBACK');
        if (error.code === '23505') { // unique violation
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Failed to create staff' });
    }
});

// DELETE /api/v1/staff/:id - Soft delete staff
router.delete('/:id', requireAuth, requireRoot, async (req, res) => {
    const { id } = req.params;
    const { root_password } = req.body; // sent in body of DELETE request

    if (!root_password) {
        return res.status(400).json({ error: 'Root password required' });
    }

    try {
        await req.db.query('BEGIN');
        
        // 1. Verify root password
        const rootUser = await req.db.query('SELECT password_hash FROM users WHERE id = $1', [req.user.user_id]);
        if (rootUser.rows.length === 0) throw new Error('Root user not found');
        
        const isMatch = await bcrypt.compare(root_password, rootUser.rows[0].password_hash);
        if (!isMatch) {
            await req.db.query('ROLLBACK');
            return res.status(401).json({ error: 'Invalid root password' });
        }

        // 2. Soft delete staff
        const { rowCount } = await req.db.query(`
            UPDATE users SET deleted_at = CURRENT_TIMESTAMP 
            WHERE id = $1 AND organization_id = $2 AND is_root = false AND deleted_at IS NULL
        `, [id, req.user.organization_id]);

        if (rowCount === 0) {
            await req.db.query('ROLLBACK');
            return res.status(404).json({ error: 'Staff not found or already deleted' });
        }

        await req.db.query('COMMIT');
        res.json({ message: 'Staff successfully deleted' });
    } catch (error) {
        await req.db.query('ROLLBACK');
        res.status(500).json({ error: 'Failed to delete staff' });
    }
});

module.exports = router;
