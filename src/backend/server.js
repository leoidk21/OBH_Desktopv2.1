// Load environment variables FIRST
const dotenv = require('dotenv');
dotenv.config();
console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET); // Debug log

const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const pool = require('./db');

const app = express();

// Request logger (MUST be before routes to log API calls)
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Request body:", req.body);
  }
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware for API routes
app.use('/api', (req, res, next) => {
  console.log(`🔥 API Request: ${req.method} ${req.originalUrl}`);
  console.log("Headers:", req.headers);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Serve static files (must be last)
app.use(express.static(path.join(__dirname, '../')));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ Database connected successfully:', res.rows[0]);
  }
});