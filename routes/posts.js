var express = require('express');
var router = express.Router();
var post = require('./../models/post.js');

var isAuthenticated = function (req, res, next) {
	if (req.session.user || req.session.secret)
		return next();
	res.redirect('/');
}

router.get('/:id', isAuthenticated, function(req,res){
	var query = post.where({ _id: req.params.id});
	query.findOne(function (err, onepost) {
		if (err) return console.error(err);
		if (onepost) {
			res.render('post', { post : onepost });
		} else {
			console.log('Empty document');
		}
	});
});

module.exports = router;
