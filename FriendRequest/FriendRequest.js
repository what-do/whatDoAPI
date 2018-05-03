var mongoose = require('mongoose');  

var FriendRequestSchema = new mongoose.Schema({
  _id: Number,
  senderName: String,
  recipient: Number,
  recipName: String
});

mongoose.model('FriendRequest', FriendRequestSchema);
module.exports = mongoose.model('FriendRequest');
