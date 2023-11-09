const Message = require('../model/message');
const User =  require('../model/user')
const Sequelize = require('sequelize');
const postMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const newMessage = await Message.create({ message, userId: req.user.id});
    res.status(201).json({ message: 'Message is posted', success: true, messgae: newMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error posting message to the database', success: false });
  }
};
const getAllMessages = async (req, res) => {
  try {
    const lastMessageId = req.query.lastMessageId || 0;

    // Retrieve messages with an id greater than the lastMessageId
    const messages = await Message.findAll({
      where: {
        id: {
          [Sequelize.Op.gt]: lastMessageId,
        },
      },
      include: {
        model: User,
        attributes: ['name'], // Include only the 'name' attribute of the User model
      },
    });

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
