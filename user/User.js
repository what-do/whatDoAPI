var mongoose = require('mongoose');  

var Activity = require('../activity/Activity');

ShortUserSchema =  new mongoose.Schema({
    id: Number,
    username: String
},{_id: false});

UserTagLikeSchema = new mongoose.Schema({
	tag: String,
	amount: Number
},{_id: false});

var UserSchema = new mongoose.Schema({  
  _id: Number,
  username: String,
  email: String,
  interests: [String],
  likes: [String],
  tagLikes: [UserTagLikeSchema],
  dislikes: [String],
  outgoingFriendRequests: [ShortUserSchema],
  incomingFriendRequests: [ShortUserSchema],
  friendList: [ShortUserSchema]
},{ _id: false });
mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');
