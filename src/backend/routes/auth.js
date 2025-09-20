// src/backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// 🔹 Helper: generate JWT
function generateToken(admin) {
  return jwt.sign(
    { id: admin.id, email: admin.email }, // 👈 id included!
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// ✅ SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO admins (first_name, last_name, email, phone, password_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, first_name, last_name, email, phone, role`,
      [firstName, lastName, email, phone, passwordHash]
    );

    const admin = result.rows[0];
    const token = generateToken(admin);

    res.status(201).json({ token, admin });
  } catch (err) {
    console.error("❌ Signup error:", err.message);
    if (err.code === '23505') {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
});

// ✅ LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // 🔍 Find admin
    const result = await pool.query(
      `SELECT * FROM admins WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const admin = result.rows[0];

    // 🔐 Compare password
    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 🔑 Generate token
    const token = generateToken(admin);

    // 🧹 Return clean admin object
    const safeAdmin = {
      id: admin.id,
      first_name: admin.first_name,
      last_name: admin.last_name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role
    };

    res.json({ token, admin: safeAdmin });

  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
