const Chat = require('../model/chat');

const postMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const newChatMessage = await Chat.create({ message, userId: req.user.id });
    res.status(201).json({ message: 'Message is posted', success: true, chat: newChatMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error posting message to the database', success: false });
  }
};

const getAllMessages = async (req, res, next) => {
  try {
    // Retrieve all chat messages from the database
    const messages = await Chat.findAll();
    res.status(200).json({ success: true, messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching messages from the database' });
  }
};

module.exports = {
  postMessage,
  getAllMessages,
};
