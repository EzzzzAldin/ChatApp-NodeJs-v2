const mongoose = require('mongoose');

const chatShema = mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
});

const Chat = mongoose.model('chat', chatShema);


module.exports = Chat;
