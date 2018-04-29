var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var Tag = require('./Tag');

//Creates a new Activity
router.post("/", function (req, res) {
    console.log('Request Received');
    console.log(req.body);
    

    var split = req.body.data.split(',');
    console.log(split.length);
    for(var i=0;i<split.length;i++){
        

        (function(cntr) {
            console.log(split[cntr]);
            var query = Tag.findOne({ 'alias': split[cntr] });
            query.then(function (oldTag) {
              //if(err) console.log(err.message);
              if(!oldTag){
                Tag.create({alias: split[cntr], weight: 0}, function(err, tag){
                    if(err) return res.status(500).send("There was a problem adding the tag."); 
                    tag.save();                
                });
              }
              else{
                oldTag.weight = 0;
                oldTag.save();
              }
              
            });
        })(i);


    }
    res.status(200).send('Tags added');
});

function addTags(parsedTags, activity){
    for(var i = 0; i < parsedTags.length; i++) {
        activity.tags.push(parsedTags[i]);
    }
}

//Returns all Activities in DB
router.get('/', function (req, res) {
    console.log('GET request');
    Tag.find({}, 
    	function (err, tags) {
        	if (err) return res.status(500).send("There was a problem finding the activities.");
        	else res.status(200).send(tags);
    	}
    );
});

module.exports = router;
