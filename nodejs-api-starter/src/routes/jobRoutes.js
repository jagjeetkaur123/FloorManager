const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticate } = require('../middleware/auth');

router.get('/', jobController.getAllJobs);
router.get('/my/listings', authenticate, jobController.getMyListings);
router.get('/:id', jobController.getJobById);
router.post('/', authenticate, jobController.createJob);
router.put('/:id', authenticate, jobController.updateJob);
router.delete('/:id', authenticate, jobController.deleteJob);

module.exports = router;
