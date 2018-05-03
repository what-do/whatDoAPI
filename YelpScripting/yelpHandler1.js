var express = require('express');
var router = express.Router();
var http = require('http');
var queryString = require('querystring');

const {spawn} = require('child_process');

var searchTerms = [
  ['airsoft', 'Airsoft'],
  ['amusementparks', 'Amusement Parks'],
  ['aquariums', 'Aquariums'],
  ['archery', 'Archery'],
  ['axethrowing', 'Axe Throwing'],
  ['bathing_area',  'Pools and Bathing Areas'],
  ['beachvolleyball', 'Beach Volleyball'],
  ['beaches', 'Beaches'],
  ['bicyclepaths', 'Bicycle Paths'],
  ['boating', 'Boating'],
  ['bocceball', 'Bocceball'],
  ['bowling', 'Bowling'],
  ['bubblesoccer', 'Bubble Soccer'],
  ['bungeejumping', 'Bungee Jumping'],
  ['carousels', 'Carousels'],
  ['challengecourses', 'Challenge Courses'],
  ['climbing', 'Climbing'],
  ['discgolf', 'Disc Golf'],
  ['diving', 'Diving'],
  ['escapegames', 'Escape Room'],
  ['experiences', 'Outdoor Experiences'],
  ['fencing', 'Fencing'],
  ['fishing', 'Fishing'],
  ['golf', 'Golf'],
  ['hiking', 'Hiking'],
  ['gokarts', 'Go Karts'],
  ['horsebackriding', 'Horseback Riding'],
  ['lakes', 'Lakes'],
  ['mini_golf', 'Mini Golf'],
  ['mountainbiking', 'Mountain Biking'],
  ['paddleboarding', 'Paddleboarding'],
  ['paintball', 'Paintball'],
  ['parks', 'Parks'],
  ['rafting', 'Rafting'],
  ['recreation', 'Recreation'],
  ['rock_climbing', 'Rock Climbing'],
  ['scavengerhunts', 'Scavenger Hunts'],
  ['skatingrinks', 'Skating Rink'],
  ['snorkeling', 'Snorkeling'],
  ['swimmingpools', 'Swimming Pools'],
  ['surfing', 'Surfing'],
  ['waterparks', 'Water Parks'],
  ['zipline', 'Ziplines'],
  ['zoos', 'Zoos'],
  ['arcades', 'Arcade'],
  ['galleries', 'Photo and Art Galleries'],
  ['bingo', 'Bingo'],
  ['casinos', 'Casinos'],
  ['movietheaters', 'Movie Theaters'],
  ['countryclubs', 'Country Clubs'],
  ['eatertainment', 'Eatertainment'],
  ['festivals', 'Festivals'],
  ['hauntedhouses', 'Haunted Houses'],
  ['makerspaces', 'Makerspaces'],
  ['museums', 'Museums'],
  ['observatories', 'Observatories'],
  ['theater', 'Theaters'],
  ['planetarium', 'Planetarium'],
  ['rodeo', 'Rodeo'],
  ['streetart', 'Street Art'],
  ['virtualrealitycenters', 'Virtual Reality'],
  ['wineries', 'Wineries'],
  ['spas', 'Spas'],
  ['hotsprings', 'Hot Springs'],
  ['artclasses', 'Art Classes'],
  ['bars', 'Bars'],
  ['lasertag', 'Laser Tag']

]

uploadTags();

function uploadTags(){
  var postData = "data="
  console.log('Uploading Tags---------------------');

for(var i in searchTerms){
  postData += searchTerms[i][0] + ',' + searchTerms[i][1] + ',';
}
postData = postData.substring(0,postData.length-1);

const options = {
  hostname: 'civil-ivy-200504.appspot.com',
  port: 443,
  //hostname: 'localhost',
  //port: 3000,
  path: '/tags',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
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
    var term = searchTerms[i][0];
    ls = spawn('node', ['./yelpScripting/yelpImp1.js', term]);
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


}

  module.exports = router;
