const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticate, authorise } = require('../middleware/auth');

// Public
router.get('/',     jobController.getAllJobs);
router.get('/:id',  jobController.getJobById);

// Protected
router.post('/',          authenticate, jobController.createJob);
router.get('/my/listings', authenticate, jobController.getMyJobs);
router.put('/:id',        authenticate, jobController.updateJob);
router.delete('/:id',     authenticate, jobController.deleteJob);

module.exports = router;
