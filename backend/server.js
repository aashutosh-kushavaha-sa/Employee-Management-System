require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Import routes (ensure route files exist)
try {
  const authRoutes = require('./routes/auth.routes');
  app.use('/api/auth', authRoutes);
} catch (e) {
  console.log('auth.routes not found or failed to load:', e.message);
}

try {
  const empRoutes = require('./routes/employee.routes');
  app.use('/api/employee', empRoutes);
} catch (e) {
  console.log('employee.routes not found or failed to load:', e.message);
}

// Default route
app.get('/', (req, res) => res.send('EMS API running'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
