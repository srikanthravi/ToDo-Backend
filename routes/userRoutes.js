const express = require('express');
const { register, login, updateProfile, getUserById, getUserByEmail, getUserInfo } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/profile', authMiddleware, updateProfile);
router.get('/profile',getUserInfo)
router.get('/users/:userId', authMiddleware,getUserById);
router.get('/users/email/:userEmail', authMiddleware,getUserByEmail);
module.exports = router;
