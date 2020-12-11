const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    image: {
        type: String,
        default: 'Naruto Wallpapers.jpg'
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    friends: {
        type: [{ name: String, image: String, id: String, chatId: String }],
        default: []
    },
    friendRequsts: {
        type: [{ name: String, id: String }],
        default: []
    },
    sentRequsts: {
        type: [{ name: String, id: String }],
        default: []
    }
});

const User = mongoose.model("user", userSchema);

module.exports = User;