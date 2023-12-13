const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const {Op} = require('sequelize');
const sequelize = require('sequelize')

const generateAccessToken = (id, name) => {
  return jwt.sign({ userId: id, name: name }, process.env.TOKEN_KEY);
};

const postUser = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    const isValid = (value) =>
      value !== null && value !== undefined && value !== "";
    if (
      !isValid(name) ||
      !isValid(password) ||
      !isValid(email) ||
      !isValid(phoneNumber)
    ) {
      return res
        .status(400)
        .json({ error: "Bad parameters. Something is missing." });
    }

    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email is already in use." });
    }
    const hash = await bcrypt.hash(password, 10);

    await User.create({ name, email, phoneNumber, password: hash });

    res.status(201).json({ message: "Successfully created a new user." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error posting the data to the database: " + err });
  }
};

const postLogin = async (req, res, next) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;
    const isValid = (value) =>
      value !== null && value !== undefined && value !== "";
    if (!isValid(password) || !isValid(email)) {
      return res
        .status(400)
        .json({ error: "Bad parameters. Something is missing." });
    }
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return res.status(401).json({ message: "User not authorized" });
    }
    const token = generateAccessToken(user.id, user.name);

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        error: "Error comparing the login data with existing data: " + err,
      });
  }
};
const allUsers = async (req, res) => {
  try {
    const keyword = req.query.search;
    // console.log('keyword>>', keyword);

    const users = await User.findAll({
      where: {
        id: { [Op.not]: req.user.id }
      }
    });
    // console.log('SQL Query:', users.toString());
// console.log('usersssss>>',users)
    res.send(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

module.exports = {
  generateAccessToken,
  postUser,
  postLogin,
  allUsers
};
