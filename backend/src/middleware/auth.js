const jwt = require('jsonwebtoken');
const { env } = require('../config');
const { pool } = require('../db');
const { redisClient } = require('../redis');

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    
    // Check blocklist in Redis
    const isBlocklisted = await redisClient.get(`blocklist:${decoded.jti}`);
    if (isBlocklisted) {
      return res.status(401).json({ error: 'Unauthorized: Token has been revoked' });
    }

    // Attach user to request
    req.user = decoded;

    // Acquire DB client and inject RLS context
    const client = await pool.connect();
    
    try {
      await client.query("SELECT set_config('app.is_super_admin', 'false', true)");
      if (decoded.organization_id) {
        await client.query("SELECT set_config('app.current_organization_id', $1, true)", [decoded.organization_id]);
      }
      
      // Attach the contextualized DB client to the request for route handlers to use safely
      req.db = client;
      
      next();
    } catch (err) {
      client.release();
      throw err;
    }

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Unauthorized: Token expired' });
    }
    return res.status(403).json({ error: 'Forbidden: Invalid token signature' });
  }
}

// Global cleanup middleware to ensure DB client is released after request finishes
function releaseDbClient(req, res, next) {
  res.on('finish', () => {
    if (req.db) {
      req.db.release();
    }
  });
  next();
}

module.exports = {
  requireAuth,
  releaseDbClient
};
