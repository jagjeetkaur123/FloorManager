const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorise } = require('../middleware/auth');

// Public
router.post('/register', userController.register);
router.post('/login',    userController.login);

// Protected
router.get('/me',        authenticate, userController.getMe);
router.put('/:id',       authenticate, userController.updateUser);

// Admin only
router.get('/',          authenticate, authorise('ADMIN'), userController.getAllUsers);
router.get('/:id',       authenticate, authorise('ADMIN'), userController.getUserById);
router.delete('/:id',    authenticate, authorise('ADMIN'), userController.deleteUser);

module.exports = router;
