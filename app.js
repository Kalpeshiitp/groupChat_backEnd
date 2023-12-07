const express = require('express');
const sequelize = require('./util/database');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./model/user');
const Message = require('./model/message');
const Group = require('./model/group');
const UserGroup = require('./model/userGroup');

const userRouter = require('./routes/user');
const messageRouter = require('./routes/message');
const groupRouter = require('./routes/group');

const app = express();

app.use(cors());
app.use(jsonParser, userRouter);
app.use(jsonParser, messageRouter);
app.use(jsonParser, groupRouter);

User.hasMany(Message);
Message.belongsTo(User);

User.hasMany(Group);
Group.hasMany(User);

Group.hasMany(Message);
Message.belongsTo(Group);

sequelize.sync()
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((err) => {
        console.log(err);
    });
