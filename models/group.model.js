const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    name: String,
    image: { type: String, default: 'Naruto Wallpapers.jpg' },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }]
});

const Group = mongoose.model("group", groupSchema);

module.exports = Group;