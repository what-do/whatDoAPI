var express = require('express');
var app = express();
var db = require('./db');

var UserController = require('./user/UserController');
app.use('/users', UserController);

var ActivityController = require('./activity/ActivityController');
app.use('/activities', ActivityController);

module.exports = app;
