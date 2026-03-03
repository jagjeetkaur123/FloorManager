const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Node.js API is running 🚀',
    version: '1.0.0',
    endpoints: {
      health:  'GET  /health',
      users:   '/api/users',
      jobs:    '/api/jobs',
    },
  });
});

module.exports = router;
