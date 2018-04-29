var User = require('./User');
var Activity = require('../activity/Activity');
var Tag = require('../tag/Tag');

const THRESHOLD_VAL = 0;
const MAX_WEIGHT_BY_NUM_ACTIVITIES = 10;

module.exports = {
    getItems: function(userId, res){
        User.findById(userId, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("No user found.");
            
            var probArray = [];

            updateUserTagWeights(user, probArray);

            populateWeights(user, probArray,res);

        });
    }
};

function updateUserTagWeights(user, probArray){ //Populate an array with tag names based on user likes
   for(var i=0; i<user.interests.length; i++){
        for(var j=0; j<10; j++){
            probArray.push(user.interests[i]);
        }
   } 
   console.log("Original array \n" + probArray);
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function populateWeights(user, probArray, res){ //Populate an array with tag names based on the weight of the tag
    Tag.find({},function(err, tags){
            for(var i=0; i<tags.length; i++){
                if(tags[i].weight>=THRESHOLD_VAL){
                    if(tags[i].weight<MAX_WEIGHT_BY_NUM_ACTIVITIES){
                        //for(var j=0; j<tags[i].weight; j++){
                            probArray.push(tags[i].alias);
                        //}
                    }
                    else{
                        //for(var j=0; j<MAX_WEIGHT_BY_NUM_ACTIVITIES; j++){
                            probArray.push(tags[i].alias);
                        //}
                    }
                }
            }
            console.log("Updated array \n" + probArray);

            getActivity(probArray, res);
    });
}

function getActivity(probArray, res){
    Activity.find({},function(err,activities){
        if(err){
            console.log(err);
        }
        var chosenItems = []; //Items to be sent as response
        //var i = 0;
        //console.log(activities);

        chosenItems = [];
        for(i = 0; i < probArray.length; i++){
            for(j = 0; j < activities.length; j++){
                for(var k = 0; k < activities[j].tags.length; k++){
                    if(activities[j].tags[k].alias == probArray[i]){
                        chosenItems.push(activities[j]);
                    }
                }
            }
        }

        while(chosenItems.length > 20){ 
            var index = getRandomArbitrary(0,chosenItems.length);
            chosenItems.splice(index, 1);
        }

        chosenItems = shuffle(chosenItems);

        /*
        while(i<20){ //Choose 20 items
            var index = getRandomArbitrary(0,probArray.length-i); //Choose a random tag
            var taggedActivities = [];
            //console.log(activities);
            for(var j in activities){ //Find all activities with this tag
                for(var k=0;k<activities[j].tags.length; k++){
                    if(activities[j].tags[k].alias == probArray[index]){
                        taggedActivities.push(activities[j]);
                        console.log(activities[j]);
                    }
                }
            }
            if(taggedActivities.length>0){ //If we have at least 1 activity to choose from, choose a random one
                var actIndex = getRandomArbitrary(0,taggedActivities.length);
                var activity = taggedActivities[actIndex];
                chosenItems.push(activity);
                activities.splice(index, 1); //Remove chosen activity
                i++;
            }
            else{
                probArray.splice(index,1); //If no activities are found with the matching tag, remove the tag from the probArray
            }
        }*/
        res.status(200).send(chosenItems);
    });
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}