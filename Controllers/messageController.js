const crypto = require("crypto");
const fs = require("fs");

const messageModel = require("../Models/messageModel");

const privateKey = fs.readFileSync("private.pem", "utf8");

const decryptData = (encryptedData) => {
  return crypto
    .privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(encryptedData, "base64"),
    )
    .toString();
};

const createMessage = async (req, res) => {
  const { chatId, text, senderId } = req.body;

  const decryptedChatId = decryptData(chatId);
  const decryptedText = decryptData(text);
  const decryptedSenderId = decryptData(senderId);

  const message = new messageModel({
    chatId: decryptedChatId,
    senderId: decryptedSenderId,
    text: decryptedText,
  });

  try {
    const response = await message.save();
    res.status(201).json(response);
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
