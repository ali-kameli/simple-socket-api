const express = require('express');
const { getUsers, getMessages } = require('../controllers/userController');
const router = express.Router();
const authMiddleware = require('../middlewares/authenticate');

router.get('/', authMiddleware, getUsers);
router.get('/messages/:roomId', authMiddleware, getMessages);

module.exports = router;
