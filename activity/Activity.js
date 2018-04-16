var mongoose = require('mongoose');  
var ActivitySchema = new mongoose.Schema({  
  name: String,
  type: String,
  image: String,
  description: String,
  yelp: String,
  tags: [{type: String}],
  address: [{type: String}]
});
mongoose.model('Activity', ActivitySchema);
module.exports = mongoose.model('Activity');
