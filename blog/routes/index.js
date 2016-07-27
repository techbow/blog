var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mongoose = require('mongoose');
var User = require('../db').User;

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', function(req, res){
	res.render('index', {
		title: 'home',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});

router.get('/reg', function(req, res){
	res.render('reg', {
		title: 'register',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});

router.post('/reg', function(req, res){
	// get password and confirm password and check whether match
	var password = req.body.password;
	var passwordtwo = req.body.passwordtwo;
	if (password != passwordtwo) {
		req.flash('error', 'password and confirmed password not match!');
		//console.log(req.session.flash);
		return res.redirect('/reg');
	}

	// hash original password to keep privacy
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('hex');

	//check whether user already registered
	User.findOne({name: req.body.name}, function(err, user){
		if (err) {
			req.flash('error', 'reg_check_error' + err);
			return res.redirect('/');
		}
		if (user) {
			req.flash('error', 'reg_check_duplicate: User Exists! Please choose another username!');
			return res.redirect('/reg');
		}
		// save hashed password together with outher info to db
		new User({
			name: req.body.name,
			password: password,
			email: req.body.email
		}).save(function(err, user){
			if (err) {
				req.flash('error', 'reg_error: ' + err);
				res.redirect('/');
			}
			req.session.user = user;
			req.flash('success', 'reg_success: Register Successfully!');
			res.redirect('/');
		});
	});
});

router.get('/login', function(req, res){
	res.render('login', {
		title: 'login',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});

router.post('/login', function(req, res){
	// hash original password to keep privacy
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('hex');

	User.findOne({name: req.body.name}, function(err, user){
		if (err) {
			req.flash('error', 'login_findUser_error: ' + err);
			return res.redirect('/');
		}
		if (!user) {
			req.flash('error', 'username or password not correct!');
			return res.redirect('/login');
		}
		// save hashed password together with outher info to db
		if (password != user.password) {
			req.flash('error', 'username or password not correct!');
			return res.redirect('/login');
		}
		req.session.user = user;
		req.flash('success', 'login successfully!');
		res.redirect('/');
	});
});

router.get('/post', function(req, res){
	res.render('post', {title: 'login'});
});

router.post('/post', function(req, res){
	
});

router.get('/logout', function(req, res){
	req.session.user = null;
	req.flash('success', 'logout successfully!');
	res.redirect('/');
});


module.exports = router;
