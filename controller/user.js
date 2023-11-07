const User = require("../model/user");
const bcrypt = require('bcrypt');
const postUser = async (req, res, next) => {
  console.log("server data>>>", req.body);
 try{
    const { name, email, phoneNumber, password } = req.body;
    bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          return res.status(500).json({ error: "Error hashing the password." });
        }
        await User.create({ name, email, phoneNumber,password: hash });
        res.status(201).json({ message: "Successfully created a new user." });
      });
 }catch(err){
    console.log(err)
    res
    .status(500)
    .json({ error: "Error posting the data to the database: " + err });
 }
};
module.exports = {
  postUser,
};
