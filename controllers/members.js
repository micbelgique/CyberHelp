'use strict';

var User = require('../models/user.js');
var nodemailer = require('nodemailer');
var _ = require('lodash');

var useragent = require('useragent');
var Moment = require('moment');
var jwt = require('jsonwebtoken');
var settings = require('../config/settings');
var random = require('random-gen');

var mandrill = require('node-mandrill')('cqquNxU71EL77FsQJcKH3w');
var fs = require('fs');
var hogan = require('hogan.js');

var sendWelcomeEmail = function (user, lang) {

	console.log('SENDING EMAIL ? ')
	var payload = {};
	var template = '';

	if(lang == 'fr')
		template = fs.readFileSync('./templates/inscription-fr.hjs', 'utf-8');
	else
		template = fs.readFileSync('./templates/inscription-en.hjs', 'utf-8');

	var compiledTemplate = hogan.compile(template);

	var message = {
		message: {
			to: [{
				email: user.email
			}],
			from_email: 'contact@smilefocus.org',
			from_name: 'SmileFocus',
			subject: 'Welcome ' + user.first_name + ' !',
			// subject: 'Merci de votre inscription!',
			html: compiledTemplate.render(payload)
		}
	};
	mandrill('/messages/send', message, function(error, response) {
		if (error) {
			console.log(error)
			return;
		} else {
			console.log('SENT!')
			return;
		}
	});
}


// CONFIG FOR SENDING EMAILS
// Replace my fake email address
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'fake-email@gmail.com',
		pass: 'BaC0n'
	}
});

exports.list = function(req, res) {
	/* GET /users */
	User.find({}).exec(function(err, users) {

		if (err) {
			console.log("db error in GET /users: " + err);
			res.render('500');
		} else {
			// if the user is not auth -> method provided by passport
			//!\\ NOT THE BEST WAY TO CHECK IF USER IS AUTH AT THAT PLACD
			// It should be a function -> see example in secrets route
			if (!req.isAuthenticated()) {
				req.flash('error', req.i18n.__("youmustbelogged"));

				// We set a session variable with the url where the user is coming from.
				req.session.redirect = req.originalUrl;
				res.redirect('/' + req.lang + '/members/login');
			} else {
				//if oK we provide our ressource
				res.send(users);
			}
		}
	});
}

exports.getthem = function(req, res){
	User.find({}).exec(function(err, users) {
		return res.render('members/getthem', {users: users});
	});

}

exports.updateCategory = function(req, res){

	console.log(req.user.categories);

	var cat = req.body.category;
	var array = req.user.categories;
	var index = array.indexOf(cat);

	console.log(index);

	if (index > -1) {
	    array.splice(index, 1);
	}
	else{
		req.user.categories.push(cat);
	}

	console.log(req.user.categories);

	req.user.save(function(err){
		if(err)
			return res.status(500).send({message: err});
		else
			return res.jsonp(req.body);
	})
}

exports.updateDevice = function(req, res){

	var agent = useragent.parse(req.headers['user-agent']);

	console.log(agent.family);
	console.log(agent.os.family);
	console.log( '°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°° ')



	req.user.baddevice = true;
	req.user.os = agent.os.family;
	req.user.browser = agent.family;





	req.user.save(function(err) {
		if(err){
			return res.status(500).send({
					message: err
			});
		}
		else{
			return res.jsonp(req.user.email);
		}
	});
}


exports.confirmation_facebook = function(req, res){
	return res.render('members/confirmationfb');
}


exports.uninstall = function(req, res) {
	if(req.params.token){
		User.findOne({jwttoken: req.params.token}, function(err, u){
			if(err)
				return res.render('members/uninstall');

			if(!u)
				return res.render('members/uninstall');

			if(u){
				u.version = 'uninstalled';
				u.save(function(e){
					return res.render('members/uninstall');
				})
			}
		});
	}else{
		return res.render('members/uninstall');
	}
}

exports.uninstallPost = function(req, res) {

	if(!req.body.comment){
		return res.render('members/uninstall');	
	}

	var user = "user";
	var subject = "Left"
	var content = '<h3>From ' + user + '</h3>Message:<br/>' + req.body.comment;

	var message = {
		message: {
			to: [{
			  email : 'contact@smilefocus.org'
			}],
			from_email: 'joao@SmileFocus.org',
			subject: subject,
			html: content
		}
	};

	mandrill('/messages/send', message, function(error, response) {
		if (error) {
			console.log(error);
			
			return res.render('members/uninstall');	
		} else {
			
			return res.render('members/uninstall');	
		}
	});
}

exports.register_charly = function(req, res){
	var user = {
		password: '',
		age: '',
		first_name: '',
		email: ''
	}
	return res.render('members/register_charly', {user: user, message : ''});
}


exports.registerLang = function(req, res) {
	var prefLang = '';

	console.log(req.headers['accept-language']);
	if (req.headers['accept-language']){
		console.log('nouveau sur le site.' + req.headers['accept-language'].substring(0, 2));
		prefLang = req.headers['accept-language'].substring(0, 2);
	}
	else{
		console.log('rien trouve.');
	}

	req.lang = prefLang;

	if (prefLang == 'fr')
		return res.redirect('/fr/members/register_smile');
	else if (prefLang == 'en')
		return res.redirect('/en/members/register_smile');
	// else if (prefLang == 'nl')
	// 	return res.redirect('/nl/');
	else
		return res.redirect('/en/members/register_smile');
}
exports.register_smile = function(req, res){
	var user = {
		password: '',
		age: '',
		first_name: '',
		email: ''
	}
	return res.render('members/register_smile', {user: user, message : ''});
}

exports.loggedfb = function(req, res){


	if(!req.user){
		console.log('loggedfb BAD.');
		return res.render('index');
	}


	return res.render('members/loggedfb', {
		token: req.user.jwttoken,
		userm: req.user.email,
		userid: req.user._id
	});
}


var loginAndFinaliseRegistration = function(req, res){

	// sendWelcomeEmail(req.user, req.lang);
	console.log('facile facile.')

	req.login(req.user, function(err) {
		if (err) {
			res.render('500');
		} else {

			return res.render('index', {
				token: req.user.jwttoken,
				userm: req.user.email,
				categories: req.user.categories,
				userid: req.user._id
			});
		}
	});
}

exports.loggedfb2 = function(req, res){
	if(!req.user){
		console.log('loggedfb BAD.');
		return res.render('index');
	}

	var query = req.query.myQuery;

	if(!query)
		query='none'

	console.log('-> ' + query);

	checkIfGodFather(req.user, query, function(rr, gf){
		if(gf){

			if(req.user.facebookId){
				req.user.pot = req.user.pot +100;
				req.user.save();
				loginAndFinaliseRegistration(req, res);
			}

			else{
				//generate email.
				req.user.secret = random.alphaNum(14);
				req.user.save(function(e){
					sendVerifEmail(user);
					loginAndFinaliseRegistration(req, res);
				});
			}
		}
		else{
			console.log('not found :(');
			loginAndFinaliseRegistration(req, res);
		}
	})
}


var sendVerifEmail = function(user){


	var payload = {
		secret : user.secret,
		userId : user._id
	}

	var template = fs.readFileSync('./templates/verifemail.hjs', 'utf-8');
	var compiledTemplate = hogan.compile(template);

	var message = {
		message: {
			to: [{
				email: user.email
			}],
			from_email: 'charly@mercicharly.com',
			subject: 'Valider votre compte mercicharly',
			// subject: 'Merci de votre inscription!',
			html: compiledTemplate.render(payload)
		}
	};
	mandrill('/messages/send', message, function(error, response) {
		if (error) {
			return;
		} else {
			return;
		}
	});
}

exports.validationPoints = function(req, res){
	if(!req.params.secret || !req.params.userId)
		return res.redirect('/' + req.lang + '/');

	else{
		User.findOne({
			_id: req.params.userId,
			secret: req.params.secret}, function(err, u){

				if(err)
					return res.redirect('/' + req.lang + '/');

				if(!u)
					return res.redirect('/' + req.lang + '/');

				if(u){
					u.pot = u.pot + 100;
					u.secret = null;

					u.save(function(err){
						User.findOne({sponsorCode: u.godfather}, function(er, _u){
							_u.pot = _u.pot + 100;
							_u.save();
							return res.render('members/validation');
						})
					})
				}
		});
	}
}

exports.errorfblogin = function(req, res){
	console.log('用戶端語系：' + req.language);

	// console.log(res.locals.message);
	console.log(JSON.parse(res.locals.message.error[0]));
	var _user = JSON.parse(res.locals.message.error[0]);

	res.locals.message = '';

	if(_user.message == 'no_email'){

		User.findOne({
			facebookId: _user.facebookId
		}, function(err, user) {
			if(err)
				console.log(err);
			else if(user){
				var token = jwt.sign(user.email, settings.jwtSecret, {
					expiresIn: settings.expiresTimeJwt // in seconds
				});

				user.jwttoken = 'JWT ' + token;
				console.log('la')
				// return res.render('members/loggedfb', {
				// 	token: user.jwttoken,
				// 	userm: user.email,
				// 	userid: user._id
				// });
				req.user = user;
				loginAndFinaliseRegistration(req, res);
			}
			else{
				console.log('ici')
				return res.render('members/errorfblogin_nomail', {user: JSON.stringify(_user)});
			}
		});


	}else{
		console.log('STILL BAD :/')
		return res.render('members/errorfblogin');
	}

}

exports.fixfbuser = function(req, res){
	console.log(req.body);
	console.log(req.body.email);
	console.log(req.body.email);
	console.log(req.body.email);

	if(!req.body.email)
		return res.render('members/register_smile');

	var _user = JSON.parse(req.body.user);
	_user.email = req.body.email;

	// _user.facebookId
	// User.find()

	User.findOne({
		facebookId: _user.facebookId
	}, function(err, user) {
		if (err) {
			console.log('POST /members/register : ' + err);
			res.render('500');

			//If user exists then we must inform the user
		} else if (user) {


			console.log('FOUND USER');

			var token = jwt.sign(user.email, settings.jwtSecret, {
				expiresIn: settings.expiresTimeJwt // in seconds
			});

			user.jwttoken = 'JWT ' + token;
			return res.render('members/loggedfb', {
				token: user.jwttoken,
				userm: user.email,
				userid: user._id
			});
		}
		//if everything alright then we try to save the user
		else {
			var user = new User(_user);
		      user.last = new Moment();

		      var token = jwt.sign(user.email, settings.jwtSecret, {
		          expiresIn: settings.expiresTimeJwt // in seconds
		      });


		      user.jwttoken = 'JWT ' + token;
		      user.save(function (err){
		        if(err){
		          console.log('Register with FACEBOOK error : ' + err);
		          res.redirect('/'+req.lang+'/members/register_smile');
		        }
		        //if no error the user is register now, we need to inform the user
		        //we log in the user too
		        else{

		        	// sendWelcomeEmail(user);
		        	console.log('JUSTE AVANT');
					// return res.render('members/loggedfb', {
					// 	token: user.jwttoken,
					// 	userm: user.email,
					// 	userid: user._id
					// });
					req.user = user;
					loginAndFinaliseRegistration(req, res);

		        }
		      });
		}
	});
}

exports.login = function(req, res) {
	var user = {
		password: '',
		email: ''
	}
	return res.render('members/login', {user: user, message : ''});
};

exports.loginPost = function(req, res) {
	User.findOne({
		email: req.body.email
	}, function(err, user) {

			if (err) {
				console.log('POST /members/register : ' + err);
				res.render('500');

				//If user exists then we must inform the user
			} else if (!user) {
				console.log('not found');
				var _user = {
					password: '',
					email: req.body.email,
					first_name: '',
					age: ''
				}
				return res.render('members/register_smile', {user: _user, message: "Votre email n'existe pas sur EasyExpress, inscrivez vous!"});
			}
			else if (!user.isValidPassword(req.body.password)) {
				req.body.password = '';
				return res.render('members/login', {user: req.body, message: "Mot de passe incorrecte"});
			}
			else {
				req.user = user;
				loginAndFinaliseRegistration(req, res);
			}

	});
}

exports.register = function(req, res) {
	return res.render('members/register');
}

exports.registerPost = function(req, res) {


	var query = req.query.myQuery;

	if(!query)
		query='none'

	console.log(query);
	console.log(req.body);

	req.lang = req.body.lang;

	if(!req.body.email)
		return res.render('members/register_smile', {user: req.body, message: "Veuillez spécifier votre email"});

	if(!req.body.password)
		return res.render('members/register_smile', {user: req.body, message: "Veuillez spécifier un mot de passe"});


	User.findOne({
		email: req.body.email
	}, function(err, user) {
		if (err) {
			console.log('POST /members/register : ' + err);
			res.render('500');

			//If user exists then we must inform the user
		} else if (user) {
			req.body.email = '';
			return res.render('members/register_smile', {user: req.body, message: "L'email est déjà existant sur notre site"});
		}
		//if everything alright then we try to save the user
		else {
			var user = new User();

			user.email = req.body.email;
			user.password = user.generateHash(req.body.password);

			user.last = new Moment();

			var token = jwt.sign(user.email, settings.jwtSecret, {
			  expiresIn: settings.expiresTimeJwt // in seconds
			});


			user.jwttoken = 'JWT ' + token;
			user.save(function(err) {
				if (err) {
					console.log('Cannot save user POST /members/register: ' + err);
					res.render('500');
				}
				//if no error the user is register now, we need to inform the user
				//we log in the user too
				else {

					var query = req.query.myQuery;

					if(!query)
						query='none'

					console.log('-> ' + query);

					req.user = user;

					loginAndFinaliseRegistration(req, res);
				}
			});
		}
	});
}

exports.logout = function(req, res) {
	console.log('ici logout');
	req.logout();
	req.flash('success', req.i18n.__("loggedout"));
	res.redirect('/' + req.lang + '/');
}

exports.forgotpassword = function(req, res) {
	return res.render('members/forgotpassword');
}

exports.forgotpasswordPost = function(req, res) {
	User.findOne({
		email: req.body.email
	}, function(err, user) {
		if (err) {
			console.log('POST /members/forgotpassword: ' + err);
			req.flash('error', req.i18n.__("somethingwrong"));
			res.redirect('/' + req.lang + '/500');
		} else if (!user) {
			req.flash('error', req.i18n.__("emaildoesntexist"));
			res.redirect('/' + req.lang + 'login');
		} else {
			// !! \\ we should send email and not redirect to that page!!!
			// demo only !!!!

			// encrypt and add salt // we should use the async way of bcrypt.. but meh.
			// we add it to our little user friend, and save it to the db
			user.secret = user.generateHash(user.email);

			user.save(function(err) {
				if (err) {
					console.log('POST save /members/forgotpassword: ' + err);
					req.flash('error', req.i18n.__("somethingwrong"));
					res.redirect('/' + req.lang + '/500');
				}

				//small trick, cannot user '/' in the URL
				// then we replace it by a '-' character
				var cleanSecret = user.secret;
				cleanSecret = cleanSecret.replace(/\//g, "-");


				// we send that EMAIL with our suppa secret code
				SendResetPasswordEmail(user.email, cleanSecret);

				res.render('members/sent-email', {
					email: user.email,
					secret: cleanSecret
				});
			});
		}
	});
}


exports.updatepwd = function(req, res) {
	// Replace '-' character by '/' (see /forgotpassword route)
	var secret = req.params.secret;
	secret = secret.replace(/-/g, '/');

	User.findOne({
		secret: secret
	}, function(err, user) {
		if (err) {
			console.log('GET /updatepwd-confirmation /' + err);
			req.flash('error', req.i18n.__("somethingwrong"));
			res.redirect('/' + req.lang + '/500');
		} else if (!user) {
			req.flash('error', req.i18n.__("user404"));
			res.redirect('/' + req.lang + '/404');
		} else {
			req.flash('success', req.i18n.__("newpasswordplz"));
			res.render('members/new-password', {
				email: user.email,
				secret: user.secret
			});
		}
	});
}

exports.newpassword = function(req, res) {
	if(!req.body.password)
		res.redirect('/' + req.lang + '/login');

	User.findOne({
		email: req.body.email,
		secret: req.body.secret
	}, function(err, user) {

		if (err) {
			console.log('POST /new-password : ' + err);
			req.flash('error', req.i18n.__("somethingwrong"));
			res.redirect('/' + req.lang + '/500');
		} else if (!user) {
			req.flash('error', req.i18n.__("user404"));
			res.redirect('/' + req.lang + '/404');
		}
		// if OK
		user.password = user.generateHash(req.body.password);
		user.secret = null;

		user.save(function(err) {
			if (err) {
				console.log('POST SAVE /new-password : ' + err);
				req.flash('error', req.i18n.__("somethingwrong"));
				res.redirect('/' + req.lang + '/500');
			}

			req.flash('success', req.i18n.__("pwupdated"));
			res.redirect('/' + req.lang + '/members/login');
		});
	});
}


exports.getPot = function(req, res){
	console.log(req.user.pot);
	return res.jsonp(req.user.pot);
}


// simple Middleware to check if auth
exports.isAuth = function(req, res, next) {
	// if the user is not auth -> method provided by passport
	if (!req.isAuthenticated()) {
		req.flash('error', req.i18n.__("youmustbelogged"));

		// We set a session variable with the url where the user is coming from.
		req.session.redirect = req.originalUrl;
		res.redirect('/' + req.lang + '/members/login');
	} else {
		next();
	}
}

exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.isAuth(req, res, function() {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				// return res.status(403).send({
				// 	message: 'User is not authorized'
				// });
				req.flash('error', req.i18n.__("user_unauthorized"));

				// We set a session variable with the url where the user is coming from.
				req.session.redirect = req.originalUrl;
				res.redirect('/' + req.lang + '/members/login');
			}
		});
	};
};

exports.isAuthApi = function(req, res, next) {
	// if the user is not auth -> method provided by passport
	if (!req.isAuthenticated()) {
		return res.status(403).send({
			message: 'no rights'
		});
	} else {
		next();
	}
}

exports.hasAuthorizationApi = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.isAuth(req, res, function() {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				return res.status(403).send({
					message: 'User is not authorized'
				});
			}
		});
	};
};


function SendResetPasswordEmail(userAddress, secret) {
	transporter.sendMail({
		from: 'stagounet@gmail.com',
		to: userAddress,
		subject: 'Next project : [PASSWORD request]',
		text: " Hello! \n\r \
If you have requested to reset your current password \n\r \
please click on the following link : \n\r \
http://localhost:3000/users/updatepwd-confirmation/" + secret + ""
	});
}
