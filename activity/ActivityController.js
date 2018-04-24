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
        address: [],
        description: req.body.description,
        yelp: req.body.yelp
		},
		function(err, activity) {
			if(err) return res.status(500).send("There was a problem adding the information to the database.");

            Activity.remove({name: activity.name, address: activity.address}, 
                function(err){
                    if(err){
                        res.status(500).send('There was an error removing a previous entry: ' + err.message);
                    }
                });

            addTags(JSON.parse(req.body.tags), activity);
            activity.address.push(JSON.parse(req.body.address));
            activity.save();
            res.status(200).send(activity);
		}
	);
});

function addTags(parsedTags, activity){
    for(var i = 0; i < parsedTags.length; i++) {
        activity.tags.push(parsedTags[i]);
    }
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
