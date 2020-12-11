const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group'
    },
    content: String,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    timestamp: Number
});

const groupMessage = mongoose.model("group-message", messageSchema);

module.exports = groupMessage;