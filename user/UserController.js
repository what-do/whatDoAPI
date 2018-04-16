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
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
        /*
        Push interests (request from user in setup)
        interests: [{type: String}],
        */
		},
		function(err, user) {
			if(err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
		}
	);
});

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

//Updates a User in DB
router.put('/:id', function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        //Implement how to add friends, likes, dislikes, and interests
        if (err) return res.status(500).send("There was a problem updating the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

module.exports = router;
