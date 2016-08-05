'use strict';
var mandrill = require('node-mandrill')('cqquNxU71EL77FsQJcKH3w');

exports.root = function(req, res) {

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
		return res.redirect('/fr/');
	else if (prefLang == 'en')
		return res.redirect('/en/');
	// else if (prefLang == 'nl')
	// 	return res.redirect('/nl/');
	else
		return res.redirect('/en/');
}



exports.index = function(req, res) {
	console.log(req.i18n.__("Hello"));

	res.render('index', {
		title: 'Express',
		name: 'Joao'
	});
};



exports.mission = function(req, res) { return res.render('main/mission', {}) }
exports.currentcause = function(req, res) { return res.render('main/currentcause', {}) }
exports.team = function(req, res) { return res.render('main/team', {}) }
exports.faq = function(req, res) { return res.render('main/faq', {}) }
exports.press = function(req, res) { return res.render('main/press', {}) }
exports.transparence = function(req, res) { return res.render('main/transparence', {}) }
exports.currentstories = function(req, res) { return res.render('main/currentstories', {}) }

exports.testing = function(req, res) { res.render('main/testing') }
exports.testing2 = function(req, res) { res.render('main/testing2') }



exports.contact = function(req, res){
	return res.render('main/contact', {contact_message: ''});
}

exports.contactPost = function(req, res){
	
	// console.log(req.body.email);

	if(!req.body.email){
		return res.redirect('/' + req.lang + '/contact')
	}

	if(!req.body.comment){
		return res.redirect('/' + req.lang + '/contact');
	}

	var subject = "Contact Form";

	if(req.body.bug)
		subject = "Bug on SimeFocus";

	if(req.body.media)
		subject = "MEDIA contact";

	if(req.body.bug)
		subject = "Contact Other";

	var user = "user";

	var content = '<h3>From ' + user + '</h3>Message:<br/>' + req.body.comment;


	var message = {
		message: {
			to: [{
			  email : 'contact@smilefocus.org'
			}],
			from_email: req.body.email,
			subject: subject,
			html: content,
			headers: {
			  "Reply-To": req.body.email
			}
		}
	};

	mandrill('/messages/send', message, function(error, response) {
		if (error) {
			console.log(error);
			
			return res.redirect('/' + req.lang + '/contact');
		} else {
			
			return res.render('main/contact', {contact_message: 'Message Sent!'})
		}
	});
}



exports.customers = function(req, res) {
	return res.render('customers', {});
}

exports.products = function(req, res) {
	return res.render('products', {});
}

exports.rewards = function(req, res) {
	return res.render('rewards/rewards', {});
}

exports.notFound = function(req, res) {
	res.render('404');
}

exports.error505 = function(req, res) {
	res.render('500');
}


exports.privacy = function(req, res){
	res.render('main/privacy');
}


