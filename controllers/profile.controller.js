const User = require('../models/user.model');

const mongoose = require('mongoose');

const DB_URL = process.env.DB_URI;

exports.getProfile = async (req, res) => {
    try {
        // Get User Id
    let id = req.params.id;
    // If I Enter My Profile
    if (!id) return res.redirect('/profile/' + req.session.userId);
    await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    const user = await User.findById(id);
    res.render('profile', {
        pageTitle: user.username,
         isUser: req.session.userId,
         friendRequests: req.friendRequests,
         myId: req.session.userId,
         myName: req.session.name,
         myImage: req.session.image,
         friendId: user._id,
         username: user.username,
         userImage: user.image,
        // First possibility Check Enter This your Profile OR Other Profile
        isOwner: id === req.session.userId,
        // Second possibility if This Profile is Friend
        isFriends: user.friends.find( friend => friend.id === req.session.userId),
        // Third possibility User1 Sent Friend Request to User2
        isRequestSent: user.friendRequsts.find( friend => friend.id === req.session.userId),
        // Forth possibility User1 Recieved Friend Request in User2
        isRequestRecieved: user.sentRequsts.find( friend => friend.id === req.session.userId)
     });  
    } catch (error) {
        res.redirect("/error");
        console.log(error);
    }       
};