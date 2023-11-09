const express = require("express");
const chatController = require('../controller/chat')
const router = express.Router();
const authenticateMiddelware = require('../middleware/auth')

router.post('/api/message',authenticateMiddelware.authenticate,chatController.postMessage);
router.get('/api/messages', authenticateMiddelware.authenticate, chatController.getAllMessages);

module.exports = router;