// routes/auth.js

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { getCurrentUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authenticate');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getCurrentUser); // Make sure this line is correct

module.exports = router;
