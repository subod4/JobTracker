require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db/connection');
const authRoutes = require('./Routes/authRoutes');
const applicationRoutes = require('./Routes/applicationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
// Mount Auth Routes (Vite proxy rewrites /api/auth -> /auth. Support both paths)
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);

// Mount Application Routes
app.use('/applications', applicationRoutes);
app.use('/api/applications', applicationRoutes);

// Root path message
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to JobTracker API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
