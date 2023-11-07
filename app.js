const express = require('express')
const sequelize = require('./util/database');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const cors = require('cors')
const User = require('./model/user')
const userRouter = require('./routes/user');
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(cors())

app.use(jsonParser,userRouter);

sequelize.sync({force:true})
.then(()=>{
    app.listen(3000)
})
.catch((err)=>{
    console.log(err)
})