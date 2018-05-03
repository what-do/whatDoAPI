var mongoose = require('mongoose');  

var Activity = require('../activity/Activity');

UserTagLikeSchema = new mongoose.Schema({
	tag: String,
	amount: Number
},{_id: false});

var UserSchema = new mongoose.Schema({  
  _id: Number,
  username: String,
  email: String,
  friends: [String],
  interests: [String],
  likes: [String],
  tagLikes: [UserTagLikeSchema],
  dislikes: [String],
  pendingFriendRequests: [String],
  friendList: [String]
},{ _id: false });
mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');
