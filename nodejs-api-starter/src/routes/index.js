const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Node.js REST API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      jobs: '/api/jobs',
    },
  });
});

module.exports = router;
