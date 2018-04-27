var mongoose = require('mongoose');  

var TagSchema = new mongoose.Schema({
  alias: String,
  weight: Number
});

mongoose.model('Tag', TagSchema);
module.exports = mongoose.model('Tag');
