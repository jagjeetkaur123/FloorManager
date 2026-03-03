require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const routes = require('./src/routes');
const userRoutes = require('./src/routes/userRoutes');
const jobRoutes = require('./src/routes/jobRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const { logger } = require('./src/utils/logger');
const { APP_PORT } = require('./src/config/config');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Main API routes
app.use('/api', routes);

// User routes
app.use('/api/users', userRoutes);

// Job routes
app.use('/api/jobs', jobRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
});

// Error handler must be last
app.use(errorHandler);

app.listen(APP_PORT, () => {
  logger.info(`Server running on port ${APP_PORT}`);
});
