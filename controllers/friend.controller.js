const User = require('../models/user.model');
const Chat = require('../models/chat.model');
const mongoose = require('mongoose');

const DB_URL = process.env.DB_URI;

exports.cancel = async (req, res) => {
    try {
            // DB Connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        await Promise.all([
            // Remove My Data To Friend FriendRequest
            User.updateOne({_id: req.body.friendId}, 
                // Pull My Data in Array FrindRequest to Friend 
                { $pull: { friendRequsts: { id: req.body.myId} }}
                ),
            // Remove Frind Data in My SentRequests
            User.updateOne({_id: req.body.myId}, 
                // Pull My Data in Array SentRequest to Friend 
                { $pull: { sentRequsts: { id: req.body.friendId} }}
                )
        ]);
        mongoose.disconnect();
        res.redirect('/profile/' + req.body.friendId);
    } catch (error) {
        res.redirect('/error');
        console.log(error);    
    }
};

exports.accept = async (req, res) => {
    try {
            let data = req.body;
        // DB connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        // To Create ChatId
        let newChat = new Chat({
            users: [data.myId, data.friendId]
        });
        let chatDoc = await newChat.save();
        // Friend => The Sender
        // My => The Receives
        await Promise.all([
            // Remove My Data Form Friend SentRequest
            User.updateOne({_id: data.friendId},
                // Pull My Data in Array SentRequest to Friend 
                { $pull: { sentRequsts: { id: data.myId} }}
                ),
            // Remove Data Friend Form My FriendRequest
            User.updateOne({_id: data.myId},
                // Pull Data Friend in Array FriendRequest to me 
                { $pull: { friendRequsts: { id: data.friendId} }}
                ),
            // Add My Data To Friend Friend Array
            User.updateOne({_id: data.friendId},
                // Push My Data in Friend Friend Array
                { $push: { friends: { 
                    id: data.myId, 
                    name: data.myName, 
                    image: data.myImage,
                    chatId: chatDoc._id
                        }
                    }
                }
                ),
                // Add Data Friend To Friend Friend Array
                User.updateOne({_id: data.myId},
                    // Push My Data in Friend Friend Array
                    { $push: { friends: { 
                        id: data.friendId, 
                        name: data.friendName, 
                        image: data.friendImage,
                        chatId: chatDoc._id
                        }
                    }
                }
                    )
        ]);
        mongoose.disconnect();
        res.redirect('/profile/' + req.body.friendId);
    } catch (error) {
        res.redirect('/error');
        console.log(error);
        }
};

exports.reject = async (req, res) => {
    try {
        let data = req.body;
        // DB Connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        await Promise.all([
            // Friend => The Sender
            // My => The Receives
            // Remove My Data To Friend SentRequest
            User.updateOne({_id: data.friendId}, 
                // Pull My Data in Array SentRequest to Friend 
                { $pull: { sentRequsts: { id: data.myId} }}
                ),
            // Remove Frind Data in My FriendRequests
            User.updateOne({_id: data.myId}, 
                // Pull My Data in Array FriendRequest to Friend 
                { $pull: { friendRequsts: { id: data.friendId} }}
                )
        ]);
        mongoose.disconnect();
        res.redirect('/profile/' + req.body.friendId);
    } catch (error) {
        res.redirect('/error');
        console.log(error);
    }
};

exports.delete = async (req, res) => {
    try {
        let data = req.body;
        // DB Connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        await Promise.all([
            // Remove My Data To Friend Array
            User.updateOne({_id: data.friendId}, 
            // Pull My Data in Array FrindRequest to Friend 
            { $pull: { friends: { id: data.myId} }}
            ),
            // Remove Frind Data in Friends Array
            User.updateOne({_id: data.myId}, 
            // Pull My Data in Array SentRequest to Friend 
            { $pull: { friends: { id: data.friendId} }}
            )
        ]);
        mongoose.disconnect();
        res.redirect('/profile/' + req.body.friendId);
    } catch (error) {
        res.redirect('/error');
        console.log(error);
    }
};

// In Frind.Socket 
exports.sendFriendRequest = async (data) => {
    // Use Try And Catch to Know if Found Error
    try {
        // DB Connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        // Add My Data To Friend FriendRequest
        await User.updateOne({_id: data.friendId}, 
            // Push My Data in Array FrindRequest to Friend 
            { $push: { friendRequsts: { name: data.myName, id: data.myId} }}
            );
        // Add Frind Data in My SentRequests
        await User.updateOne({_id: data.myId}, 
            // Push My Data in Array FrindRequest to Friend 
            { $push: { sentRequsts: { name: data.friendName, id: data.friendId} }}
            );
        mongoose.disconnect();
        return
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.getFriends = async id => {
    // Use Try And Catch to Know if Found Error
    try {
        // DB connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        // Get Friend Requests
        let data = await User.findById(id, { friends: true});
        return data.friends;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    };
};

exports.getFriendRequests = async id => {
    // Use Try And Catch to Know if Found Error
    try {
        // DB connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        // Get Friend Requests
        let data = await User.findById(id, { friendRequsts: true});
        return data.friendRequsts;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    };
};