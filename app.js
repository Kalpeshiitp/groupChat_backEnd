const express = require('express')
const sequelize = require('./util/database');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const cors = require('cors')
const dotenv = require("dotenv");
dotenv.config();

const User = require('./model/user')
const Chat = require('./model/chat')

const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat')

const app = express();

app.use(cors())
app.use(jsonParser,userRouter);
app.use(jsonParser,chatRouter);

User.hasMany(Chat);
Chat.belongsTo(User);

sequelize.sync()
.then(()=>{
    app.listen(3000)
})
.catch((err)=>{
    console.log(err)
})