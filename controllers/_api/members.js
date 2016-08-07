var User = require('../../models/user.js');
var jwt = require('jsonwebtoken');
var settings = require('../../config/settings');

var loginAndFinaliseRegistration = function(req, res){
	req.login(req.user, function(err) {
		if (err) {
			res.render('500');
		} else {
			return res.jsonp({
				user: req.user,
				token: req.user.jwttoken,
				userm: req.user.email,
				categories: req.user.categories,
				userid: req.user._id
			});
		}
	});
}


exports.loginPost = function(req, res) {
	console.log(req.body);

	User.findOne({
		email: req.body.email
	}, function(err, user) {

		if (err) {
			return res.status(500).send({
				message: err
			});

		} else if (!user) {
			return res.status(404).send({
				message: 'not found'
			});
		}
		else if (!user.isValidPassword(req.body.password)) {
			return res.status(403).send({
				message: 'bad password'
			});
		}
		else {
			var token = jwt.sign(user.email, settings.jwtSecret, {
				expiresIn: settings.expiresTimeJwt // in seconds
			});

			user.jwttoken = 'JWT ' + token;
			console.log(user.jwttoken);

			req.user = user;
			loginAndFinaliseRegistration(req, res);
		}
	});
}

exports.userById = function(req, res, next, id) {
	User.findById(id).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load notification ' + id));
		req.user = user;
		next();
	});
};