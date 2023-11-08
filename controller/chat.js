const Chat = require('../model/chat');
const User = require("../model/user");

const postmessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        const newChatMessage = await Chat.create({ message:message});
        res.status(201).json({ message: 'Message is posted', success: true, chat: newChatMessage });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error posting message to the database', success: false });
    }
}

module.exports = {
    postmessage
}
