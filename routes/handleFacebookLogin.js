/*
  Author : Joao Pinto
   - pinto.joao@outlook.com
*/

var express = require('express');
var router = express.Router();

var User = require('./../models/user');
var settings = require('../config/settings');

var random = require('random-gen');

var Moment = require('moment');


var mandrill = require('node-mandrill')('cqquNxU71EL77FsQJcKH3w');
var fs = require('fs');
var hogan = require('hogan.js');


var jwt = require('jsonwebtoken');

var api_key = 'key-b8c5c237fd45cf9dafda70dab4f7dcb3';
var domain = 'smilefocus.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var mailcomposer = require('mailcomposer');


var sendMailgunEmail = function (user) {

	var c1 = Math.floor((Math.random() * 1000) + 100);
	var c2 = Math.floor((Math.random() * 1000) + 100);
	var c3 = Math.floor((Math.random() * 1000) + 100);

	var payload = {
		code01: 'CHARLY'+c1,
		code02: 'CHARLY'+c2,
		code03: 'CHARLY'+c3
	}

	var template = fs.readFileSync('./templates/inscription.hjs', 'utf-8');
	var compiledTemplate = hogan.compile(template);


	var mail = mailcomposer({
	  from: 'charly@mercicharly.com',
	  to: user.email,
	  subject: 'Merci ' + user.first_name + ' !',
	  // body: 'Test email text',
	  html: compiledTemplate.render(payload)
	});


	mail.build(function(mailBuildError, message) {

	    var dataToSend = {
	        to: user.email,
	        message: message.toString('ascii')
	    };


	    mailgun.messages().sendMime(dataToSend, function (sendError, body) {
	        if (sendError) {
	            console.log(sendError);
	            return;
	        }
	    });
	});
}

var sendWelcomeEmail = function (user, lang) {

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
      return;
    } else {
      return;
    }
  });
}


module.exports = function(accessToken, refreshToken, profile, done) {

  console.log(profile);

	console.log('iiiiiiiii');


    var u =  {
      name: profile.displayName,
      first_name: profile._json.first_name,
      last_name: profile._json.last_name,
      facebookId: profile.id,
      picture: profile.photos[0].value,
      gender: profile._json.gender,
      age_range_min: profile._json.age_range.min,
      age_range_max: profile._json.age_range.max,

      local: profile._json.locale
    };

    if(!profile.emails){
      console.log('fuck this shit: NO EMAIL');
      	u.message = 'no_email';
    	return done(null, false, { message: JSON.stringify(u)});
    }

    console.log(' ============= = == ==========');
    console.log(' ============= = == ==========');
    console.log(' ============= = == ==========');
    console.log(' ============= = == ==========');

    var u =  {
          name: profile.displayName,
          first_name: profile._json.first_name,
          last_name: profile._json.last_name,
          facebookId: profile.id,
          picture: profile.photos[0].value,
          email: profile.emails[0].value,
          gender: profile._json.gender,
          age_range_min: profile._json.age_range.min,
          age_range_max: profile._json.age_range.max,

          local: profile._json.locale
        };

    u.email = profile.emails[0].value,



 	console.log('facebook user : '+  u.email);


  //Verify information provided by facebook
  //check if user email exists in database
  User.findOne({email: u.email}, function (err, user){

    if(err){
      return done('POST /users/register : ' + err);

    //If user exists then we login
    } else if (user){
		var token = jwt.sign(user.email, settings.jwtSecret, {
          expiresIn: settings.expiresTimeJwt // in seconds
        });

		user.baddevice = false;
        user.jwttoken = 'JWT ' + token;

        user.save(function(err){
        	if(err){
        		console.log('Register with FACEBOOK error : ' + err);
        		done(null, false, { message: 'internal Error sorry we could not make it' });
        	}
        	else{
        		done(null, user, { message: 'You are now logged with your facebook account' , token: 'JWT ' + token });
      			console.log('IM LOGGED.');
        	}
        })

    }
    //if everything alright then we try to save the user
    else{
      var user = new User(u);

      user.email = u.email;
      user.picture = u.picture;

      user.last = new Moment();
      user.sponsorCode = random.alphaNum(10);


      var token = jwt.sign(user.email, settings.jwtSecret, {
          expiresIn: settings.expiresTimeJwt // in seconds
      });


      user.jwttoken = 'JWT ' + token;

      user.save(function (err){
        if(err){
          console.log('Register with FACEBOOK error : ' + err);
          done(null, false, { message: 'internal Error sorry we could not make it' });
        }
        //if no error the user is register now, we need to inform the user
        //we log in the user too
        else{

        	// sendMailgunEmail(user);
        	sendWelcomeEmail(user, 'en');

          done(null, user, {message: 'Successfully register with facebook account'});
        }
      });
    }
  });
};
