var mongoose = require('mongoose');  
var UserSchema = new mongoose.Schema({  
  name: String,
  email: String,
  password: String,
  friends: [{type: String}],
  interests: [{type: String}],
  likes: [{type: String}],
  dislikes: [{type: String}]
});
mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');
