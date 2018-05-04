var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('../user/User');
var FriendRequest = require('./FriendRequest');


//Creates a new friend request
router.post("/:id", function (req, res) {
    console.log("ID: " + req.params.id + " RECIPIENT: " + req.body.recipient);
    User.findById(req.params.id, function(err, user){ //Make sure users arent already friends
        if(!(~user.friendList.indexOf(req.body.recipient))){
            FriendRequest.findOne({_id: req.params.id, recipName: req.body.recipient}, function(err, freq){
                if(!freq){
                    User.findOne({username: req.body.recipient}, function(err, recipient){
                        console.log(recipient.username);
                        FriendRequest.create({_id: req.params.id, senderName: user.username, recipient: recipient._id, recipName: recipient.username}, function(err, friendRequest){ //Search for an existing friend request, if none exists create one
                            if(err) return res.status(500).send("There was a problem adding the information to the database.");
                            var update1 = {$push: {outgoingFriendRequests: {id: recipient._id, username: recipient.username}}};
                            var update2 = {$push: {incomingFriendRequests: {id: req.params.id, username: user.username}}};
                            User.findByIdAndUpdate(req.params.id, update1, function(err, outRequest){ //Update user request lists
                                if(err) console.log(err);
                            });
                            User.findByIdAndUpdate(recipient._id, update2, function(err, incRequest){
                                if(err) console.log(err);
                            });
                            res.status(200).send(friendRequest);
                        });
                    });                    
                }
                else{
                    //console.log(freq);
                    res.status(500).send("Request already exists");
                }
             });
         }
         else{
            res.status(500).send("Friend already exists");
         }
    });

});



//Returns all requests for a user
router.get('/:id', function (req, res) {
    FriendRequest.find({recipient: req.params.id}, 
        function (err, requests) {
            if (err) return res.status(500).send("There was a problem finding the requests.");
            res.status(200).send(requests);
        }
    );
});

router.post("/respond/:id", function (req, res) {
    FriendRequest.findOneAndRemove({_id: req.body.sender, recipient: req.params.id }, function(err, friendRequest){
        //console.log("---------------" + friendRequest);
        FriendRequest.findOneAndRemove({_id: req.params.id, recipient: req.body.sender }, function(err){
        if(err) console.log(err); //1: original sender, 2: original recipient
        //console.log('Updating user lists');
        var update1 = {$pull: {outgoingFriendRequests: {id: req.params.id}, incomingFriendRequests: {id: req.params.id}}}; //If declined, remove friend request from each users outgoing and incoming lists
        var update2 = {$pull: {incomingFriendRequests: {id: req.body.sender}, outgoingFriendRequests: {id: req.body.sender}}};
        console.log(req.body.value + " " + (req.body.value == "ACCEPT"));
        if(req.body.value.valueOf() == "ACCEPT"){
            update1 = {$pull: {outgoingFriendRequests: {id: req.params.id}, incomingFriendRequests: {id: req.params.id}}, $push: {friendList: {id: req.params.id, username: friendRequest.recipName}}};
            update2 = {$pull: {incomingFriendRequests: {id: req.body.sender}, outgoingFriendRequests: {id: req.body.sender}}, $push:{friendList: {id: req.body.sender, username: friendRequest.senderName}}};

        }
        User.findByIdAndUpdate(req.params.id, update2, function(err, outRequest){ //Update user request lists
            if(err) console.log(err);
            //console.log('Sender Updated');
        });
        User.findByIdAndUpdate(req.body.sender, update1, function(err, incRequest){
            if(err) console.log(err);
            //console.log('Recipient Updated');
        });
        res.status(200).send(req.body.sender + " " + req.body.value);

        });
    });
});

router.post("/remove/:id", function (req, res){
    //console.log(req.body.friend);
    var update1 = {$pull: {friendList: {username: req.body.friend}}};
    var update2 = {$pull: {friendList: {id: req.params.id}}};
    User.findByIdAndUpdate(req.params.id, update1, function(err, user1){
        console.log("Deleted " + req.body.friend + " from friend list");
    });
    User.findOneAndUpdate({username: req.body.friend}, update2, function(err, user2){
        if(user2) {
            console.log("Deleted user with ID " + req.params.id + " from friend list");
            res.status(200).send("Friend remove complete");
        }
        else{
            console.log(req.body.friend + " does not match a username in our database");
            res.status(500).send(req.body.friend + " does not match a username in our database");
        } 
    });
    
});

module.exports = router;
