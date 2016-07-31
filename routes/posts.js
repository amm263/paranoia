var express = require('express');
var router = express.Router();
var Post = require('./../models/post.js');

var isAuthenticated = function (req, res, next) {
	return next(); //DEBUG ON
	if (req.session.user || req.session.secret)
		return next();
	res.redirect('/');
}

router.get('/:id', isAuthenticated, function(req,res){
	var query = Post.where({ _id: req.params.id});
	query.findOne(function (err, onepost) {
		if (err) return console.error(err);
		if (onepost) {
			res.render('posts/post', { post : onepost });
		} else {
			console.log('Empty document');
		}
	});
});

router.get('/edit/:id', isAuthenticated, function(req,res){
	var query = Post.where({ _id: req.params.id});
	query.findOne(function (err, onepost) {
		if (err) return console.error(err);
		if (onepost) {
			res.render('posts/editpost', { post : onepost });
		} else {
			console.log('Empty document');
		}
	});
});

router.post('/edit', isAuthenticated, function(req,res){
	var query = Post.where({ _id: req.body.postid});
	query.findOne(function (err, onepost) {
		if (err) return console.error(err);
		if (onepost) {
			onepost.title = req.body.posttitle;
			onepost.content = req.body.postcontent;
			onepost.save(function (err, onepost) {
			if (err) return console.error(err);
			else res.redirect("/posts/"+req.body.postid);
			});
		}
	});	
});

router.post('/delete', isAuthenticated, function(req,res){
	var query = Post.find().remove({ _id: req.body.postid })
	query.exec();
	res.redirect("../admin/dashboard")
});




module.exports = router;
