var express = require('express');
var app = express();
var db = require('./db');

var UserController = require('./user/UserController');
app.use('/users', UserController);

var ActivityController = require('./activity/ActivityController');
app.use('/activities', ActivityController);

var TagController = require('./tag/TagController');
app.use('/tags', TagController);

// var YelpHandler = require('./YelpScripting/yelpHandler1');
// app.use('/tasks/yelpScript', YelpHandler);

var FriendRequestController = require('./FriendRequest/FriendRequestController');
app.use('/friendrequest', FriendRequestController);

module.exports = app;
