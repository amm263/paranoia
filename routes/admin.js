var express = require('express');
var router = express.Router();
var Post = require('./../models/post.js');
var Secret = require('./../models/secret.js');
var User = require('./../models/user.js');
var Visit = require('./../models/visit.js');
var moment = require('moment');

 
var isAdmin = function (req, res, next) {
	return next(); //DEBUG ON
	if (req.session.user)
		return next();
	res.redirect('/');
}

/*----	Admin panel/bashboard ----*/
router.get('/dashboard', isAdmin, function(req, res) {
	Post.find(function (err, postlist) {
		if (err) return console.error(err);
		res.render('admin/admin', { 
			title : 'Express',
			postlist : postlist,
			username : req.session.user
		});
	});		
});

/*---- 	New Post ----*/
router.get('/newpost', isAdmin, function(req, res) {
	res.render('admin/newpost', { title: 'New post' });
});

router.post('/newpost', isAdmin, function(req, res) {
	var postentry = new Post({
		title: req.body.posttitle,
		content: req.body.postcontent,
		date: new Date()
	});
	
	// @todo Generate markup file and store or update on disk /static
	postentry.save(function (err, postentry) {
		if (err) return console.error(err);
		else res.redirect("/admin/dashboard");
	});
});	

/*	Secrets	
 * 		List all secrets and (@todo) visits per secret. 
 * 		Also offers POST form to add new secrets. 							*/
router.get('/secrets', isAdmin, function(req, res) {
	var db = req.db;
	Secret.find(function (err, secretlist) {
		if (err) return console.error(err);
		res.render('admin/secrets', { 
			title: 'New secret',
			secretlist: secretlist, 
			moment: moment
		});
	});
});

router.post('/secrets', isAdmin, function(req, res) {
	var secret = new Secret({
		secret: req.body.secret,
		note: req.body.note,
		last_access: new Date()
	});
	
	secret.save(function (err, secret) {
		if (err) return console.error(err);
		else res.redirect("admin/secrets");
	});
});	

// Renders all visits per secretid in a JSON list. 
router.get('/visits/:secretid', isAdmin, function(req, res) {
	Visit.find({ 'secret_id': req.params.secretid}).		//Find all Visits by secret_id
	select('-_id access_date user_agent ip location').		//Only show desired keys. (_id must be forced off)										
	sort('-access_date').									//Sort by access_date, descending
	limit('30').exec(function(err, visitlist) {				//Limit to first 30 objects and execute query
		if (visitlist) {
			res.json(visitlist);
		} else {
			console.log('Can not find '+req.params.secretid+' visits list');
		}
	});
});

/*----	Login ----*/
router.get('/login', function(req, res) {
	res.render('admin/login');
});

router.post('/login', function(req, res) {
	var query = User.where({ username: req.body.username});
	query.findOne(function (err, user) {
		if (err) return console.error(err);
		if (user && user.passwordIsValid(req.body.password)) {
			req.session.user = user.username;
			res.redirect("/admin/dashboard");
		} else {
			console.log('No user or password match');
			res.render('login', {message: "Nice try"});
		}
	});
});	

/*	Install						
* 		Makes the first user		
* 
*		@todo	Offer first time admin registration. /admin/install
*				Add /register new user, and distinguish admins from 
* 				editors or reviewers.  		*/
router.get('/install', function(req, res){
	User.find(function (err, userlist) {
		if (err) return console.error(err);
		if (userlist) res.render('admin/install_done');
	});		
    res.render('register', {message: "Create your first user"});
});
  
router.post('/install', function(req, res) {
	User.find(function (err, userlist) {
		if (err) return console.error(err);
		if (userlist) res.redirect("admin/install");
	});		
	var query = User.where({ username: req.body.username});
	query.findOne(function (err, user) {
		if (err) return console.error(err);
		if (user) {
			res.render('admin/register', {message: "User already exist"});
		} else {
			var newUser = new User({
					username: req.body.username,
				});
				
			newUser.passwordSet(req.body.password);	
		
			newUser.save(function (err, newUser) {
				if (err) return console.error(err);
				else res.redirect("/admin/login");
			});
		}
	});	
});  

/*----	Change password	----*/
router.get('/password/change', isAdmin, function(req,res){
	res.render('admin/password/change', {user: req.session.user});
});

router.post('/password/change', isAdmin, function(req,res){
	var query = User.where({ username: req.session.user});
	query.findOne(function (err, user) {
		if (err) return console.error(err);
		if (user && user.passwordIsValid(req.body.password)) {
				user.passwordSet(req.body.newpassword);
				user.save(function (err, user) {
					if (err) return console.error(err);
					else res.render('admin/password/change', {message: "Password changed succesfully!"});
				});
		} else res.render('admin/password/change', {message: "Error: Password not changed."});
	});	
});


module.exports = router;
