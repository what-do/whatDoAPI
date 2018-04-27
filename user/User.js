var mongoose = require('mongoose');  

var Activity = require('../activity/Activity');

var UserSchema = new mongoose.Schema({  
  _id: Number,
  username: String,
  email: String,
  password: String,
  friends: [String],
  interests: [String],
  likes: [String],
  dislikes: [String]
},{ _id: false });
mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');
