'use strict';
var mandrill = require('node-mandrill')('xxx');

var mongoose = require('mongoose'),
	School = require('../models/school.js');

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
	res.render('index', {
		title: '',
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

	if(!req.body.email){
		return res.redirect('/' + req.lang + '/contact')
	}

	if(!req.body.comment){
		return res.redirect('/' + req.lang + '/contact');
	}

	var subject = "Contact Form";

	if(req.body.bug)
		subject = "Bug on website";

	if(req.body.media)
		subject = "MEDIA contact";

	if(req.body.bug)
		subject = "Contact Other";

	var user = "user";

	var content = '<h3>From ' + user + '</h3>Message:<br/>' + req.body.comment;


	var message = {
		message: {
			to: [{
			  email : 'contact@xxx.org'
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


var request = require('request');

exports.superadmin = function(req, res){
	request('http://localhost:3001/api/schools', 
		function (error, response, body) {

	  console.log(body);
	  if (!error && response.statusCode == 200) {
	  	console.log('okay');
	    res.render('main/superadmin', {
			schools : body
		});
	  }
	})
}

exports.director = function(req, res){
	res.render('main/director', {
		schoolId: req.user.school
	});
};

exports.teacher = function(req, res){
	res.render('main/teacher', {
		schoolId: req.user.school,
		classroomId: req.user.classroom
	});
};





