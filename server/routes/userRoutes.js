const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', userController.register);

// @route   POST api/users/login
// @desc    Login a user & get token
// @access  Public
router.post('/login', userController.login);

// @route   GET api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, userController.getMe);

module.exports = router;