var mongoose = require('mongoose');  

var TagSchema = new mongoose.Schema({
  alias: String,
  title: String
},{ _id : false });

var ActivitySchema = new mongoose.Schema({  
  name: String,
  type: String,
  image: String,
  description: String,
  yelp: String,
  tags: [TagSchema],
  address: [{
  	city: String,
  	country: String,	
  	address2: String,
  	address3: String,
    state: String,
    address1: String,
    zip_code: String
  }],
});
mongoose.model('Activity', ActivitySchema);
module.exports = mongoose.model('Activity');
