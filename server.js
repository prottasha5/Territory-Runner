require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Routes
const authRoutes = require('./routes/authRoutes');
const runRoutes = require('./routes/runRoutes');
const territoryRoutes = require('./routes/territoryRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/run', runRoutes);
app.use('/api/territory', territoryRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Page Routes
const checkAuth = (req, res, next) => {
  const token = req.cookies?.token || req.query?.token;
  if (!token) {
    return res.redirect('/login');
  }
  next();
};

// Login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Signup page
app.get('/signup', (req, res) => {
  res.render('signup');
});

// Home page
app.get('/', (req, res) => {
  res.render('home');
});

// Run page
app.get('/run', (req, res) => {
  res.render('run');
});

// Leaderboard page
app.get('/leaderboard', (req, res) => {
  res.render('leaderboard');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Application is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server bound to host ${HOST}`);
});