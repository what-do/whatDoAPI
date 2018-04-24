var express = require('express');
var router = express.Router();

const {spawn} = require('child_process');

var searchTerms = [
  'airsoft',
  'amusementparks',
  'aquariums',
  'archery',
  'axethrowing',
  'bathing_area',
  'beachvolleyball',
  'beaches',
  'bicyclepaths',
  'boating',
  'bocceball',
  'bowling',
  'bubblesoccer',
  'bungeejumping',
  'carousels',
  'challengecourses',
  'climbing',
  'discgolf',
  'diving',
  'escapegames',
  'experiences',
  'fencing',
  'fishing',
  'golf',
  'hiking',
  'gokarts',
  'horsebackriding',
  'lakes',
  'mini_golf',
  'mountainbiking',
  'paddleboarding',
  'paintball',
  'parks',
  'rafting',
  'recreation',
  'rock_climbing',
  'scavengerhunts',
  'skatingrinks',
  'snorkeling',
  'swimmingpools',
  'surfing',
  'waterparks',
  'zipline',
  'zoos',
  'arcades',
  'galleries',
  'bingo',
  'casinos',
  'movietheaters',
  'countryclubs',
  'eatertainment',
  'festivals',
  'hauntedhouses',
  'makerspaces',
  'museums',
  'observatories',
  'theater',
  'planetarium',
  'rodeo',
  'streetart',
  'virtualrealitycenters',
  'wineries',
  'spas',
  'hotsprings',
  'artclasses',
  'bars',
  'lasertag'

]

for(var i in searchTerms){
	//sleep(1000);
	var term = searchTerms[i];
	ls = spawn('node', ['./YelpScripting/yelpImp1.js', term]);
	ls.stdout.on('data', (data) => {
  console.log(""+data);
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});


}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

module.exports = router;
