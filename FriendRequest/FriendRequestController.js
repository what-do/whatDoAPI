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
            FriendRequest.findOne({_id: req.params.id, recipient: req.body.recipient}, function(freq){
                if(!freq){
                    User.findById(req.body.recipient, function(err, recipient){
                        //console.log(recipient);
                        FriendRequest.create({_id: req.params.id, senderName: user.username, recipient: req.body.recipient, recipName: recipient.username}, function(err, friendRequest){ //Search for an existing friend request, if none exists create one
                            if(err) return res.status(500).send("There was a problem adding the information to the database.");
                            var update1 = {$push: {outgoingFriendRequests: {id: req.body.recipient, name: recipient.username}}};
                            var update2 = {$push: {incomingFriendRequests: {id: req.params.id, name: user.username}}};
                            User.findByIdAndUpdate(req.params.id, update1, function(err, outRequest){ //Update user request lists
                                if(err) console.log(err);
                            });
                            User.findByIdAndUpdate(req.body.recipient, update2, function(err, incRequest){
                                if(err) console.log(err);
                            });
                            res.status(200).send(friendRequest);
                        });
                    });                    
                }
             });
         }
    });

});



//Returns all requests for a user
router.get('/:id', function (req, res) {
    User.find({recipient: req.params.id}, 
        function (err, requests) {
            if (err) return res.status(500).send("There was a problem finding the requests.");
            res.status(200).send(requests);
        }
    );
});

router.post("/respond/:id", function (req, res) {
    FriendRequest.findOneAndRemove({_id: req.body.sender, recipient: req.params.id }, function(err, friendRequest){
        //console.log("---------------" + friendRequest);
        FriendRequest.remove({_id: req.params.id, recipient: req.body.sender }, function(err){
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

module.exports = router;
