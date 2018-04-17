var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var Activity = require('./Activity');

//Creates a new Activity
router.post("/", function (req, res) {
	Activity.create(
		{
        type: req.body.type,
        name: req.body.name,
        image: req.body.image,
        tags: [],
        address: req.body.address,
        description: req.body.description,
        yelp: req.body.yelp
		},
		function(err, activity) {
			if(err) return res.status(500).send("There was a problem adding the information to the database.");
            addTags(JSON.parse(req.body.tags), activity);
            addAddress(JSON.parse(req.body.address), activity);
            res.status(200).send(activity);
		}
	);
});

function addTags(parsedTags, activity){
    for(var i = 0; i < parsedTags.length; i++) {
        activity.tags.push(parsedTags[i]);
    }
}

function addAddress(parsedAddress, activity){

}

//Returns all Activities in DB
router.get('/', function (req, res) {
    Activity.find({}, 
    	function (err, activities) {
        	if (err) return res.status(500).send("There was a problem finding the activities.");
        	res.status(200).send(activities);
    	}
    );
});

module.exports = router;
