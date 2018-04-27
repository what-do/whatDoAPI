var mongoose = require('mongoose');  

var TagSchema = new mongoose.Schema({
  alias: String,
  weight: Number
},{ _id : false });

mongoose.model('Tag', TagSchema);
module.exports = mongoose.model('Tag');
