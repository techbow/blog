var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mongoose = require('mongoose');
var User = mongoose.model('User');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', function(req, res){
	res.render('index', {title: 'home'});
});

router.get('/reg', function(req, res){
	res.render('reg', {title: 'register'});
});

router.post('/reg', function(req, res){
	// get password and confirm password and check whether match
	var password = req.body.password;
	var passwordtwo = req.body.passwordtwo;
	if (password != passwordtwo) {
		req.flash('error', 'password and confirmed password not match!');
		//console.log(req.session.flash);
		res.redirect('/reg');
	}

	// hash original password to keep privacy
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('hex');

	//check whether user already registered
	User.findOne({name: req.body.name}, function(err, user){
		if (err) {
			req.flash('reg_check_error', err);
			return res.redirect('/');
		}
		if (user) {
			req.flash('reg_check_duplicate', 'User Exists! Please choose another username!');
			return res.redirect('/reg');
		}
		// save hashed password together with outher info to db
		new User({
			name: req.body.name,
			password: password,
			email: req.body.email
		}).save(function(err, user){
			if (err) {
				req.flash('reg_error', err);
				res.redirect('/');
			}
			req.session.user = user;
			req.flash('reg_success', 'Register Successfully!');
			res.redirect('/');
		});
	});
});

router.get('/login', function(req, res){
	res.render('login', {title: 'login'});
});

router.post('/login', function(req, res){
	
});

router.get('/post', function(req, res){
	res.render('post', {title: 'login'});
});

router.post('/post', function(req, res){
	
});

router.get('/logout', function(req, res){
	
});


module.exports = router;
