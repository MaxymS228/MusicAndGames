const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: true 
  }, 
  sender: { 
    type: String, 
    required: true 
  }, 
  timestamp: { 
    type: Date, 
    default: Date.now 
  }, 
});

const Chat = mongoose.model("Chat", chatSchema, "chats");
module.exports = Chat;