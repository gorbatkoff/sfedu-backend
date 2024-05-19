const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  members: Array,
}, {
  timestamps: true
});

const chatModel = mongoose.model("Chat", userSchema);

module.exports = chatModel