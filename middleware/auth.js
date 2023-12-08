const jwt = require('jsonwebtoken');
const User = require('../model/user');
const dotenv = require("dotenv");
dotenv.config();
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    console.log("auth token", token);
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token must be provided' });
    }
    const user = jwt.verify(token, process.env.TOKEN_KEY);
    console.log('user', user)
    const response = await User.findByPk(user.userId);
    req.user = response;
    console.log('response', response)
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
module.exports = {
  authenticate,
};
