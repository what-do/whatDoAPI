var express = require('express');
var router = express.Router();
var http = require('http');
var queryString = require('querystring');

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

uploadTags();

function uploadTags(){
  var postData = "data="
  console.log('Uploading Tags---------------------');

for(var i in searchTerms){
  postData += searchTerms[i] + ',';
}
postData = postData.substring(0,postData.length-1);

const options = {
  //hostname: 'civil-ivy-200504.appspot.com',
  hostname: 'localhost',
  port: 3000,
  path: '/tags',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  //console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    //console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('Tags uploaded');
    doSearch();
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// write data to request body
req.write(postData);
req.end();
}


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function doSearch(){
  var size = 0;
  for(var i in searchTerms){
    //sleep(1000);
    var term = searchTerms[i];
    ls = spawn('node', ['./yelpImp1.js', term]);
    ls.stdout.on('data', (data) => {
    console.log(""+data);
  });

  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  // ls.on('close', (code) => {
  //   //console.log(`child process exited with code ${code}`);
  //   size++;
  //   if(size>=searchTerms.length){
  //     uploadTags();
  //   }
  // });

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
}
