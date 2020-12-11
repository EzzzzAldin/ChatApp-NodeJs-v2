const Message = require('../models/message.model');
const Chat = require('../models/chat.model');

const mongoose = require('mongoose');

const DB_URL = process.env.DB_URI;

exports.getChat = async (req, res) => {
    try {
        // Get Chat Id
    let chatId = req.params.id;
    // DB connect
    await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    //  Get Message Data And Replace Chat Id By Populate To Get Data
    let messages = await Message.find({
            chat: chatId
            }, null, {
                sort: {
                    timestamp: 1
                    }
                }).populate({
                    // Name Filed
                    path: 'chat',
                    // Location to Filed
                    model: 'chat',
                        populate: {
                            path: 'users',
                            model: 'user',
                            select: 'username image'
                        }
                 });
        // If Do not Found Message To get Data User
        if (messages.length === 0) {
            //  Get Data User And Replace Chat Id By Populate To Get Data
            let chat = await Chat.findById(chatId).populate('users');
            let friendData = chat.users.find(
                user => user._id != req.session.userId
            );
            res.render('chat', {
                pageTitle: friendData.username,
                isUser: req.session.userId,
                friendRequests: req.friendRequests,
                messages: messages,
                friendData: friendData,
                chatId: chatId
            })
        } else {
        // Get Friend Data From Message Model
        let friendData = messages[0].chat.users.find(
                user => user._id != req.session.userId
        );
        res.render('chat', {
            pageTitle: friendData.username,
            isUser: req.session.userId,
            friendRequests: req.friendRequests,
            messages: messages,
            friendData: friendData,
            chatId: chatId
        })
    }
    mongoose.disconnect();
    } catch (error) {
        res.redirect('/error');
        console.log(error);
    }
};

exports.newMessage = async message => {
    // Use Try And Catch to Know if Found Error
    try {
        // DB connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        message.timestamp = Date.now();
        // Create New Message And Save In DB
        let newMessage = new Message(message);
        await newMessage.save();
        mongoose.disconnect();
        return
    } catch (error) {
        mongoose.disconnect();
        throw Error(error);
    }
};