const express = require("express");
const userController = require('../controller/user')
const router = express.Router();
const authenticateMiddelware = require('../middleware/auth')

router.post('/user/signup', userController.postUser);
router.post('/user/login',userController.postLogin)
router.get('/user', authenticateMiddelware.authenticate,userController.allUsers);

module.exports = router;