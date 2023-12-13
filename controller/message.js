const Message = require('../model/message');
const UserGroup = require('../model/userGroup');
const User = require('../model/user');

const postMessage = async (req, res, next) => {
  try {
    // console.log('message body', req.body);
    const { message, groupId } = req.body;
    const newMessage = await Message.create({ message, userId: req.user.id, groupGroupId: groupId });
    res.status(201).json({ message: 'Message is posted', success: true, message: newMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error posting message to the database', success: false });
  }
};
const getAllMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const loggedInUser = req.user.id
    const messages = await Message.findAll({
      where: { groupGroupId: groupId },
      include: [{ model: User, attributes: ['name'] }], 
    });
    // console.log('messages>>>>', messages);
    res.status(200).json({ success: true, messages ,loggedInUser});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching messages from the database' });
  }
};

module.exports = {
  postMessage,
  getAllMessages,
};
