const mongoose = require('../config/mongo')

const messageSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    message: String,
    historial: Array,
  }, {timestamps: true});
  
const MessageModel = mongoose.model('Messages', messageSchema);

module.exports = MessageModel