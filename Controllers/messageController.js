const messageModel = require("../Models/messageModel");

// creatingMessage
// gettingMessages

const createMessage = async (req, res) => {
  const { chatId, text, senderId } = req.body;

  const message = new messageModel({
    text,
    chatId,
    senderId,
  });

  try {
    const response = await message.save();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await messageModel.find({ chatId });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createMessage,
  getMessages,
};
