var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('./User');

//Creates a new User
router.post("/", function (req, res) {
	User.create(
		{
		_id: req.body.id,
        username: req.body.username,
		email: req.body.email,
		password: req.body.password,
        friends: [],
        interests: [],
        likes: [],
        dislikes: []
		},
		function(err, user) {
			if(err) return res.status(500).send("There was a problem adding the information to the database.");
            console.log(req.body.interests);
            addInterests(JSON.parse(req.body.interests), user);
            user.save();
            res.status(200).send(user);
		}
	);
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

//Deletes a User in DB
router.delete('/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send("User "+ user.name +" was deleted.");
    });
});

//Updates a User's password in DB
router.put('/password/:id', function (req, res) {
    var update = { password: req.body.password };
    User.findByIdAndUpdate(req.params.id, update, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

//Updates a User's interests in DB
router.put('/interests/:id', function (req, res) {


    interests = [];

    if(req.body.interests){
        query = User.findById(req.params.id);
        query.then(function(user){ 
            parsedInterests = JSON.parse(req.body.interests);    
            for(let i = 0; i < parsedInterests.length; i++) {
                    var newInterest = true;
                    for(var j = 0; j < user.interests.length; j++){
                        console.log('Comparing ' + parsedInterests[i] + ' to ' + user.interests[j]);
                        if(parsedInterests[i] == user.interests[j]){
                            console.log('Interest exists');
                            newInterest = false;
                        }
                    }
                    if(newInterest){
                        interests.push(parsedInterests[i]);
                        console.log(interests);
                    }
            }
            var update = { $push: {"interests" : interests }};
        
            User.findByIdAndUpdate(req.params.id, update, {new: true}, function (err, user) {
                if (err) return res.status(500).send("There was a problem updating the user.");
                if (!user) return res.status(404).send("No user found.");
                res.status(200).send(user);
            });
        });
    }
});
/*
    var query = Band.findOne({name: "Guns N' Roses"});
    assert.ok(!(query instanceof Promise));

    // A query is not a fully-fledged promise, but it does have a `.then()`.
    query.then(function (doc) {
      // use doc
    });
*/

module.exports = router;
