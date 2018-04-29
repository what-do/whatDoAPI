var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('./User');
var Activity = require('../activity/Activity');
var pullAlgorithm = require('./pullAlgorithm');

//Creates a new User
router.post("/", function (req, res) {
    query = User.findById(req.body.id);
    query.then(function (user) {
        if (user) return res.status(404).send("User with given id already exists.");
        query = User.findOne({ 'username': req.body.username});
        query.then(function (user) {
            if (user) return res.status(404).send("Username " + user.username + " taken.");
            User.create(
                {
                    _id: req.body.id,
                    username: req.body.username,
                    email: req.body.email,
                    friends: [],
                    interests: [],
                    likes: [],
                    dislikes: []
                }, function(err, user) {
                    if(err) return res.status(500).send("There was a problem adding the information to the database.");
                    if(req.body.interests) addInterests(JSON.parse(req.body.interests), user);
                    user.save();
                    res.status(200).send(user);
                }
            );
        });
    });
});

function addInterests(parsedInterests, user){
    for(var i = 0; i < parsedInterests.length; i++) {
        user.interests.push(parsedInterests[i]);
    }
}

//Returns all Users in DB
router.get('/', function (req, res) {
    User.find({}, 
        function (err, users) {
            if (err) return res.status(500).send("There was a problem finding the users.");
            res.status(200).send(users);
        }
    );
});

//Returns a User in DB
router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

//Deletes a User from DB
router.delete('/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send("User "+ user.username +" was deleted.");
    });
});

//Updates User email in DB
router.put('/email/:id', function (req, res) {
    if(req.body.email){
        console.log('attempting to add email ' + req.body.email);
        var update = { email: req.body.email };
        User.findByIdAndUpdate(req.params.id, update, {new: true}, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
            if (!user) return res.status(404).send("No user found.");
            console.log(user.email);
            res.status(200).send(user);
        });
    } else{
        res.status(404).send("No email update received.");
    }
});

//Returns User interests
router.get('/interests/:id', function (req, res) {
    User.findById(req.params.id, 'interests', function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(JSON.stringify(user.interests));
    });
});

//Adds User interests to DB
router.put('/addinterests/:id', function (req, res) {
    interests = [];

    if(req.body.interests){
        query = User.findById(req.params.id);
        query.then(function(user){ 
            if (!user){
                return res.status(404).send("No user found.");
            }
            parsedInterests = JSON.parse(req.body.interests);    
            for(let i = 0; i < parsedInterests.length; i++) {
                    var newInterest = true;
                    for(var j = 0; j < user.interests.length; j++){
                        if(parsedInterests[i].toLowerCase() == user.interests[j]){
                            newInterest = false;
                        }
                    }
                    if(newInterest){
                        interests.push(parsedInterests[i].toLowerCase());
                    }
            }
            var update = { $push: {"interests" : interests }};
        
            User.findByIdAndUpdate(req.params.id, update, {new: true}, function (err, user) {
                if (err) return res.status(500).send("There was a problem updating the user.");
                res.status(200).send(user);
            });
        });
    } else{
        res.status(404).send("No interests to add received.");
    }
});

//Removes User interests from DB
router.put('/removeinterests/:id', function (req, res) {
    if(req.body.interests){
        User.findById(req.params.id, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("No user found.");
            parsedInterests = JSON.parse(req.body.interests);    
            for(let i = 0; i < parsedInterests.length; i++) {
                user.interests.remove(parsedInterests[i]);
            }
            user.save();
            res.status(200).send(user);
        });
    } else{
        res.status(404).send("No interests to remove received.");
    }
});

//Returns User likes
router.get('/likes/:id', function (req, res) {
    User.findById(req.params.id, 'likes', function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        var likes = [];

        for (var i = 0; i < user.likes.length; i++) {
            (function(cntr) {
                Activity.findOne({ 'yelp': user.likes[cntr]}, function(err, activity){
                    likes.push(activity);
                    if(cntr == user.likes.length-1){
                        res.status(200).send(likes);
                    }
                });
            })(i);
        }

        if(user.likes.length == 0) res.status(200).send([]);
    });
});

//Adds User like to DB
router.put('/addlike/:id', function (req, res) {
    if(req.body.like){
        query = User.findById(req.params.id);
        query.then(function(user){ 
            if (!user){
                return res.status(404).send("No user found.");
            }
            var newLike = true;
            for(var j = 0; j < user.likes.length; j++){
                if(req.body.like == user.likes[j]){
                    newLike = false;
                }
            }
            if(newLike){
                var update = { $push: {"likes" : req.body.like}};              
                User.findByIdAndUpdate(req.params.id, update, {new: true}, function (err, user) {
                    if (err) return res.status(500).send("There was a problem updating the user.");
                    res.status(200).send(user);
                });

                //Find activites, add to tagLikes  
                User.findById(req.params.id, function(user){
                    Activity.findOne({'yelp': req.body.like}, function(activity){
                        for(var i in activity.tags){
                            var found = false;
                            for(var tag in user.tagLikes){
                                if(tag.tag.equals(activity.tags[i].alias)){
                                    tag.amount ++;
                                    found = true;
                                }
                            }
                            if(!found){
                                user.tagLikes.push({'tag': activity.tags[i].alias, 'amount': 1});
                            }
                        }
                        user.save();
                    });                    
                });

            } else{
                res.status(404).send("User already liked the activity.");
            }      

        });
    } else{
        res.status(404).send("No like to add received.");
    }
});

//Removes User like from DB
router.put('/removelike/:id', function (req, res) {
    if(req.body.like){
        User.findById(req.params.id, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("No user found.");
            user.likes.remove(req.body.like);
            user.save();
            res.status(200).send(user);
        });
    } else{
        res.status(404).send("No like to remove received.");
    }
});

//Returns activities to populate user feed
router.get('/activities/:id', function (req, res) {
    pullAlgorithm.getItems(req.params.id, res);
});

module.exports = router;
