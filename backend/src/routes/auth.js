const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const { env } = require('../config');
const { pool } = require('../db');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    const { rows } = await pool.query(`
      SELECT u.*, o.billing_status 
      FROM users u 
      LEFT JOIN organizations o ON u.organization_id = o.id 
      WHERE u.email = $1
    `, [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (rows[0].billing_status === 'deactivated') {
      return res.status(403).json({ error: 'Deactivated account' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const jti = randomUUID();
    const token = jwt.sign(
      {
        user_id: user.id,
        organization_id: user.organization_id,
        is_root: user.is_root,
        jti
      },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // In a real app, generate HttpOnly refresh token here as well

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
