const express = require("express");
const router = express.Router();
const messageController = require('../controller/message')
const authenticateMiddelware = require('../middleware/auth')

router.post('/api/message',authenticateMiddelware.authenticate,messageController.postMessage);
router.get('/api/messages', authenticateMiddelware.authenticate, messageController.getAllMessages);

module.exports = router;