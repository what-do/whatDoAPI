const THRESHOLD_VAL = 0;
const MAX_WEIGHT_BY_NUM_ACTIVITIES = 0;


function getItems(userId){
	User.findById(userId, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        
        var probArray;

        updateUserTagWeights(user, probArray);

        populateWeights(user, probArray);

    });
}

updateUserTagWeights(user, probArray){ //Populate an array with tag names based on user likes
   for(var i=0; i<user.tagLikes.length;i++){
        for(var j=0;j<user.tagLikes[i].amount){
            probArray.push(user.tagLikes[i].tag);
        }
   } 
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function populateWeights(user, probArray){ //Populate an array with tag names based on the weight of the tag
    Tags.find({},function(err, tags){
            for(var i=0; i<tags.length; i++){
                if(tags[i].weight>=THRESHOLD_VAL){
                    if(tags[i]weight<MAX_WEIGHT_BY_NUM_ACTIVITIES){
                        for(var j=0; j<tags[i].weight; j++){
                            probArray.push(tags[i]);
                        }
                    }
                    else{
                        for(var j=0; j<MAX_WEIGHT_BY_NUM_ACTIVITIES; j++){
                            probArray.push(tags[i]);
                        }
                    }
                }
            }

            getActivity(probArray);

    });
}
function getActivity(probArray){
    Activity.find({},{'lean':true},function(err,activities){
        if(err){
            console.log(err);
        }
        var chosenItems; //Items to be sent as response
        var i = 0;
        while(i<20){ //Choose 20 items
            var index = getRandomArbitrary(0,probArray.length-i); //Choose a random tag
            var taggedActivities;
            for(var j in activities){ //Find all activities with this tag
                for(var k=0;k<activites[j].tags.length){
                    if(activites[j].tags[k].alias.equals(probArray[i])){
                        taggedActivities.push(activities[j]);
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
        }
        sendResponse(chosenItems);
    });
}