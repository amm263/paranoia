var express = require('express');
var router = express.Router();
var Post = require('./../models/post.js');
var User = require('../models/user');
var Secret = require('../models/secret');
var Visit = require('../models/visit');
var geoip = require('geoip-lite');

var isAuthenticated = function (req, res, next) {
	if (req.session.user || req.session.secret)
		return next();
	res.render('nope');
}

/* 	GET Home
 * 		Authentication (through Login or Secrets) is required.	 		*/
router.get('/', isAuthenticated, function(req, res) {
	Post.find(function (err, postlist) {
		if (err) return console.error(err);
		res.render('index', { 
			title : 'Express',
			postlist : postlist 
		});
	});		
});


/* 	Initialize session through Secrets
 * 		@todo Prevent bruteforcing at application level.				*/
router.get('/:secret', function(req, res, next) {
	var query = Secret.where({ secret: req.params.secret});
	var visit;
	var location;
	query.findOne(function (err, secret) {
		if (err) return console.error(err);
		if (secret) {
			// Visitor knows the right secret, start session (@todo renew if exists?) 
			req.session.secret = secret.secret;
			res.redirect('/');
			// Then track this access
			location = geoip.lookup(req.ip),
			visit = new Visit({
				secret_id: secret._id,
				user_agent: req.headers['user-agent'],
				ip: req.ip,
				location: location,
				access_date: new Date(),
			});
			// And store it
			visit.save(function (err, visit) {
				if (err) return console.error(err);
			});
		} else {
			console.log('Wrong secret: '+req.params.secret);
			res.redirect('/');
		}
	});
});	



module.exports = router;
