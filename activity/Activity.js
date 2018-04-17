var mongoose = require('mongoose');  

var TagSchema = new mongoose.Schema({
  alias: String,
  title: String
},{ _id : false });

var AddressSchema = new mongoose.Schema({
    address1: String,
    address2: String,
  	address3: String,
    city: String,
    state: String,
  	country: String,	    
    zip_code: String,
    display_address: [String]
},{ _id : false });

var ActivitySchema = new mongoose.Schema({  
  name: String,
  type: String,
  image: String,
  description: String,
  yelp: String,
  tags: [TagSchema],
  address: [AddressSchema]
});
mongoose.model('Activity', ActivitySchema);
module.exports = mongoose.model('Activity');
