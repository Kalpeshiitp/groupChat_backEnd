const express = require('express');

const router = express.Router();

const groupController = require('../controller/group')
const authenticateMiddelware =  require('../middleware/auth')


router.post('/api/chat/group',authenticateMiddelware.authenticate, groupController.postCreateGroup);
router.get('/api/chat/group',authenticateMiddelware.authenticate, groupController.getGroup);
router.get('/group/:groupId',authenticateMiddelware.authenticate,groupController.getGroup);

module.exports = router;