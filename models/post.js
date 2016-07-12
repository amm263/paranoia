var mongoose = require('mongoose');

// Database schema
var postSchema = mongoose.Schema({
	title: String,
	content: String,
	date: { type: Date, default: Date.now }
});

var post = mongoose.model('Post', postSchema);

module.exports = post;
