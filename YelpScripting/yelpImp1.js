var https = require('https');
var http = require('http');
var queryString = require('querystring');

_term = process.argv[2];

function doSearch(term, ofs){

  const options = {
    hostname: 'api.yelp.com',
    port: 443,
    //path: '/v3/businesses/search?latitude=30.2669444&longitude=-97.7427778&radius=40000&categories=bowling&limit=50',
    path: '/v3/businesses/search?location=Austin,78704&radius=40000&categories=' + term + '&limit=50&offset=' + ofs + '',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer A2czL4xmBFkpfeyPZnF3k8VYFOZYsWSiyYMY1rhLQZ5EpPpYTu7uIX6qH1xUj8dwm9quS_geNbU22165jI_Ub3Yj21rPs2JwAooLQtl62NZLLx3PMPk9S5PD1muxWnYx' 
    }
  };

  //console.log('still here');

  const req = https.request(options, (res) => { 

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => {
      rawData+= chunk;
    });
    res.on('end', () => {
    	if(res.statusCode == 429){
    		doSearch(term, offset);
    	}
    	else{
        try{
          //console.log("HEADER: " + JSON.stringify(res.headers));
          parsedData = JSON.parse(rawData);
          console.log('---------------------------------------------------------------------');
          console.log('Conducting Yelp search for term :"'+ term + '", offset:' + ofs);
          console.log('---------------------------------------------------------------------');
          console.log('STATUS: ' + res.statusCode);
          console.log('Found '+parsedData['total']+ ' results');
          for(var i=0; i<parsedData['businesses'].length; i++){

            console.log(parsedData['businesses'][i]['name']);
            var b = parsedData['businesses'][i];
            var type = 'activity';
            var name = b['name'];
            var image_link = b['image_url'];
            var tags = JSON.stringify(b['categories']);
            var address = JSON.stringify(b['location']);
            var yelp_link = b['url'];
            var result = {'name': name, 'image': image_link, 'type': type, 'tags': tags, 'address': address, 'yelp': yelp_link, 'description': ''};
            
            pushResult(result);
            //Send result to DB
          }
          if(parsedData['businesses'].length >= 50){
            doSearch(term, ofs + 50);
          }

        }
        catch(e){
          console.error(e.message);
        }
      }
    });
  });

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// write data to request body
req.end();
}

var offset = 0;
var ret = doSearch(_term, offset);

function pushResult(result){
  postData = queryString.stringify(result);
  console.log("========================================");
  console.log('SENDING RESULT FOR: ' + result['name']);
  console.log("========================================");

const options = {
  hostname: 'civil-ivy-200504.appspot.com',
  port: 443,
  // hostname: 'localhost',
  // port: 3000,
  path: '/activities',
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
    //console.log('');
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
