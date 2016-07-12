var mongoose = require('mongoose');
 
module.exports = mongoose.model('Access',{
        secret_id: String,
        user_agent: String,
		ip: String,
		location: String, //@todo String? Not sure this is lazy or neat. 
		access_date: Date
});
