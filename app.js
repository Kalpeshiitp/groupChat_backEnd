const http = require("http");
const express = require("express");
const sequelize = require("./util/database");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const { Server } = require("socket.io");
const User = require("./model/user");
const Message = require("./model/message");
const Group = require("./model/group");
const UserGroup = require("./model/userGroup");
const userRouter = require("./routes/user");
const messageRouter = require("./routes/message");
const groupRouter = require("./routes/group");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.resolve("./public")));
app.get("/", (req, res) => {
  return res.sendFile("signup/signup.html", { root: path.resolve("./public") });
});

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

sequelize.sync().then(() => {
  server.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});


io.on("connection", (socket) => {
    console.log("New user has connected", socket.id);
    socket.on("newGroup", (groupId) => {
      socket.join(groupId);
    });
    socket.on("sendMessage", (message) => {
      io.to(message.groupId).emit("receiveMessage", message);
    });
    socket.on("openChatBox", (groupId) => {
      socket.join(groupId);
    });
  
    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });