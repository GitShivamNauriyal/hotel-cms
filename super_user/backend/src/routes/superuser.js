const express = require('express');
const bcrypt = require('bcrypt');
const { requireAuth } = require('../middleware/auth');
const { pool } = require('../db');

const router = express.Router();

router.use(requireAuth);

// GET /organizations
router.get('/organizations', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT id, name, subdomain, billing_status, created_at
            FROM organizations
            ORDER BY created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error("GET /organizations error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /organizations
router.post('/organizations', async (req, res) => {
    const { name, subdomain, root_email, root_password } = req.body;

    if (!name || !subdomain || !root_email || !root_password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Create organization
        const orgRes = await client.query(`
            INSERT INTO organizations (name, subdomain) 
            VALUES ($1, $2) RETURNING id, name, subdomain, billing_status
        `, [name, subdomain]);

        const org = orgRes.rows[0];

        // Hash root user password
        const password_hash = await bcrypt.hash(root_password, 10);

        // Create root user
        await client.query(`
            INSERT INTO users (organization_id, email, password_hash, is_root)
            VALUES ($1, $2, $3, true)
        `, [org.id, root_email, password_hash]);

        await client.query('COMMIT');
        res.status(201).json(org);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("POST /organizations error:", err);
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Subdomain or email already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

// PUT /organizations/:id/status
router.put('/organizations/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== 'active' && status !== 'deactivated') {
        return res.status(400).json({ error: 'Status must be active or deactivated' });
    }

    try {
        const result = await pool.query(`
            UPDATE organizations SET billing_status = $1 WHERE id = $2 RETURNING id, billing_status
        `, [status, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("PUT /organizations/:id/status error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /organizations/:id/users
router.get('/organizations/:id/users', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query(`
            SELECT id, email, full_name, staff_category, is_root, created_at
            FROM users
            WHERE organization_id = $1 AND deleted_at IS NULL
            ORDER BY created_at ASC
        `, [id]);
        res.json(rows);
    } catch (err) {
        console.error("GET /organizations/:id/users error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /users/:id
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { email, password, super_admin_password } = req.body;

    if (!super_admin_password) {
        return res.status(400).json({ error: 'Super Admin password is required for verification' });
    }

    try {
        // Step 1: Verify Super Admin's password from super_users table
        const saRes = await pool.query(`
            SELECT password_hash FROM super_users WHERE id = $1
        `, [req.user.id]);

        if (saRes.rows.length === 0) {
            return res.status(403).json({ error: 'Super Admin account not found' });
        }

        const isValid = await bcrypt.compare(super_admin_password, saRes.rows[0].password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Super Admin verification failed' });
        }

        // Step 2: Update the target user in users table
        let updates = [];
        let values = [];
        let idx = 1;

        if (email) {
            updates.push(`email = $${idx++}`);
            values.push(email);
        }

        if (password) {
            const password_hash = await bcrypt.hash(password, 10);
            updates.push(`password_hash = $${idx++}`);
            values.push(password_hash);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        const query = `
            UPDATE users SET ${updates.join(', ')} WHERE id = $${idx} RETURNING id, email, is_root
        `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("PUT /users/:id error:", err);
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Email already in use' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /organizations/:id/staff
router.post('/organizations/:id/staff', async (req, res) => {
    const { id } = req.params;
    const { email, password, full_name, staff_category, super_password } = req.body;

    if (!email || !password || !full_name || !staff_category || !super_password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Verify super user password
        const saRes = await client.query('SELECT password_hash FROM super_users WHERE id = $1', [req.user.id]);
        if (saRes.rows.length === 0) throw new Error('Super user not found');
        
        const isMatch = await bcrypt.compare(super_password, saRes.rows[0].password_hash);
        if (!isMatch) {
            await client.query('ROLLBACK');
            return res.status(401).json({ error: 'Invalid super user password' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const { rows } = await client.query(`
            INSERT INTO users (organization_id, email, password_hash, full_name, staff_category, is_root)
            VALUES ($1, $2, $3, $4, $5, false)
            RETURNING id, email, full_name, staff_category, created_at
        `, [id, email, password_hash, full_name, staff_category]);
        
        await client.query('COMMIT');
        res.status(201).json(rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("POST /organizations/:id/staff error:", err);
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

// DELETE /organizations/:id/staff/:staffId
router.delete('/organizations/:id/staff/:staffId', async (req, res) => {
    const { id, staffId } = req.params;
    const { super_password } = req.body;

    if (!super_password) {
        return res.status(400).json({ error: 'Super Admin password required' });
    }

    try {
        await pool.query('BEGIN');
        
        const saRes = await pool.query('SELECT password_hash FROM super_users WHERE id = $1', [req.user.id]);
        if (saRes.rows.length === 0) throw new Error('Super Admin not found');
        
        const isMatch = await bcrypt.compare(super_password, saRes.rows[0].password_hash);
        if (!isMatch) {
            await pool.query('ROLLBACK');
            return res.status(401).json({ error: 'Invalid Super Admin password' });
        }

        const { rowCount } = await pool.query(`
            UPDATE users SET deleted_at = CURRENT_TIMESTAMP 
            WHERE id = $1 AND organization_id = $2 AND is_root = false AND deleted_at IS NULL
        `, [staffId, id]);

        if (rowCount === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ error: 'Staff not found or already deleted' });
        }

        await pool.query('COMMIT');
        res.json({ message: 'Staff successfully deleted' });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("DELETE staff error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
