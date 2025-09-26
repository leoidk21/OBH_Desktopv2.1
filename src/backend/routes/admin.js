// src/backend/routes/admin.js
const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware: verify token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded; // decoded payload (must contain id!)
    next();
  });
}

// GET /api/admin/me → current logged-in admin
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;

    const result = await pool.query(
      `SELECT id, first_name, last_name, email, phone, role
       FROM admins
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("/admin/me error:", err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// EDIT PROFILE
router.put("/me", authenticateToken, async (req, res) => {
  try {
    const adminId = req.user.id || req.user.userId;
    const { first_name, last_name, email, phone } = req.body;

    const result = await pool.query(
      `UPDATE admins
       SET first_name = $1, last_name = $2, email = $3, phone = $4
       WHERE id = $5
       RETURNING *`,
      [first_name, last_name, email, phone, adminId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }

    res.json({ success: true, admin: result.rows[0] });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, error: "Server error" });
    }
});

module.exports = router;
