var mongoose = require('mongoose');
 
module.exports = mongoose.model('Secret',{
        secret: String,
		note: String,
		last_access: Date
});
