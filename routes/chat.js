const express = require("express");
const chatController = require('../controller/chat')
const router = express.Router();

router.post('/api/message', chatController.postmessage);

module.exports = router;