const Group = require('../models/group.model');
const groupMessage = require('../models/group-message');
const getFriends = require('../controllers/friend.controller').getFriends;

const mongoose = require('mongoose');

const DB_URL = process.env.DB_URI;

exports.getUserGroups = async (req, res) => {
    try {
        let userId = req.session.userId;
        // DB connect 
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        // Get Users From UserModel
        let groups = await Group.find({
            users: {
                $all: [userId]
            }
        });
        res.render('groups', {
            pageTitle: 'Groups',
            isUser: req.session.userId,
            friendRequests: req.friendRequests,
            groups: groups
        })
        mongoose.disconnect();
    } catch (error) {
        res.redirect('/error');
        console.log(error);
    }
};

exports.getCreateGroup = (req, res) => {
    // Get Data Friends
    getFriends(req.session.userId).then(friends => {
        res.render('create-group', {
            pageTitle: 'Create Group',
            isUser: req.session.userId,
            friendRequests: req.friendRequests,
            friends: friends
        })
    }).catch(err => {
        res.redirect("/error");
    });
};

exports.postCreateGroup = async (req, res) => {
    try {
        // DB connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        //  Get Data User And Replace Chat Id By Populate To Get Data
        let group = await new Group(req.body);
        let groupData = await group.save();
        res.redirect("/groups/" + groupData._id);
        mongoose.disconnect();
    } catch (error) {
        res.redirect("/error");
    }
};

exports.getGroup = async (req, res) => {
    try {
            // Get Chat Id
        let groupId = req.params.id;
        // DB connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        //  Get Message Data And Replace Chat Id By Populate To Get Data
        let messages = await groupMessage.find({
                group: groupId
                }, null, {
                    sort: {
                        timestamp: 1
                        }
                    }).populate({
                        // Name Filed
                        path: 'group',
                        // Location to Filed
                        model: 'group',
                            populate: {
                                path: 'users',
                                model: 'user',
                                select: 'username image'
                            }
                    }).populate({
                        path: 'sender',
                        model: 'user',
                        select: 'username image'
                    });
            // If Do not Found Message To get Data User
            if (messages.length === 0) {
                // Get Users From UserModel
                let group = await Group.findById(groupId).populate({
                    path: 'users',
                    model: 'user',
                    select: 'username image'
                })
                res.render('group-chat', {
                    pageTitle: group.name,
                    isUser: req.session.userId,
                    friendRequests: req.friendRequests,
                    messages: messages,
                    group: group
                })
            } else {
            res.render('group-chat', {
                pageTitle: messages[0].group.name,
                isUser: req.session.userId,
                friendRequests: req.friendRequests,
                messages: messages,
                group: messages[0].group
            })
        }
    } catch (error) {
        res.redirect("/error");
    }
};

exports.newMessage = async message => {
    try {
        // DB connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        message.timestamp = Date.now();
        // Create New Message And Save In DB
        let newMessage = new groupMessage(message);
        await newMessage.save();
        mongoose.disconnect();
        return
    } catch (error) {
        mongoose.disconnect();
        throw Error(error);
    }
};