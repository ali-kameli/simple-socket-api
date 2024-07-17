const express = require('express');
const { getMessages, sendMessage } = require('../controllers/messageController');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

router.get('/:receiverId', authenticate, getMessages);
router.post('/', authenticate, sendMessage);

module.exports = router;
