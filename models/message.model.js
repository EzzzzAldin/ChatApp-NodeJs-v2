const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chat'
    },
    content: String,
    sender: String,
    timestamp: Number
});

const Message = mongoose.model('message', messageSchema);

module.exports = Message;