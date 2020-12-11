const User = require('../models/user.model');
const getFriends = require('../controllers/friend.controller').getFriends;
const mongoose = require('mongoose');

const DB_URL = process.env.DB_URI;

exports.getHome = (req, res) => {
    res.render('index', {
        pageTitle: 'Home',
        isUser: req.session.userId,
        friendRequests: req.friendRequests
    })
};

exports.getFriends = (req, res) => {
    getFriends(req.session.userId).then(friends => {
        res.render('friends', {
            pageTitle: 'Friends',
            isUser: req.session.userId,
            friendRequests: req.friendRequests,
            friends: friends
        })
    }).catch(err => {
        res.redirect("/error");
    })
};

exports.getSearch = async (req, res) => {
    try {
        if (!req.query.name) {
            res.render('search', {
                pageTitle: 'Friends',
                isUser: req.session.userId,
                friendRequests: req.friendRequests,
                users: null,
                searchMode: false
            })
        } else {
            // DB connect
            await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
            // Find User By Regualr Expretion
            let users = await User.find({ username: { $regex: new RegExp('^' + req.query.name, 'i')}});
            res.render('search', {
                pageTitle: 'Friends',
                isUser: req.session.userId,
                friendRequests: req.friendRequests,
                users: users,
                searchMode: true
            })
        }
    } catch (error) {
        res.redirect("/error");
        console.log(error);
    }
};