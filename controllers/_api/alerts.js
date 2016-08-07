'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
	Alert = require('../../models/alert.js'),
	Classroom = require('../../models/classroom.js'),
	_ = require('lodash');
	var request = require('request');

/**
 * Create a customer
 */
exports.create = function(req, res) {
	var alert = new Alert(req.body);
	console.log(req.body);
	alert.user = req.user;

	alert.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			return res.jsonp(alert);
		}
	});
};

/**
 * Show the current alert
 */
exports.read = function(req, res) {
	res.jsonp(req.alert);
};

/**
 * Update a alert
 */
exports.update = function(req, res) {
	var alert = req.alert;

	alert = _.extend(alert, req.body);
	/*Send notification if accepted*/
	
	alert.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			if(alert.status==="accepted"){
				var bearer ="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIyNWFjNDAzNS0zNGE3LTRjMTgtYWVmOS01YzlhYmY1N2E1MDMifQ.io-z3EyqqhINuudBY3aTlF7n7TwI8_omCktL2qGYrD8";
				var push = {
					"user_ids": [alert.ionicToken],
					 "profile": "test",
					"notification": {
						"message":"Hello World!"
					}
				}
				console.log("Push data" ,push);				//Lets configure and request
				request({
					url: 'https://api.ionic.io/push/notifications', //URL to hit
					method: 'POST',
					headers: { //We can define headers too
						'Content-Type': 'application/json',
						'Authorization': 'Bearer '+bearer
					},
					//Lets post the following key/values as form
					json: push
				}, function(error, response, body){
					if(error) {
						console.log(error);
					} else {
						console.log(" Respond sent to ionic platefform",JSON.stringify(body))
						return res.jsonp(alert);
					}
				});
			}
			else{
				res.jsonp(alert);
			}
			
		}
	});
};

/**
 * Delete a alert
 */
exports.delete = function(req, res) {

	var alert = req.alert;

	alert.remove(function(err) {
		if (err) {
			return res.status(400).send({ message: err });
		} else {
			res.jsonp(alert);
		}
	});
};

/**
 * List of Alerts
 */
exports.list = function(req, res) {
	//console.log("User ", req.user);
	Alert
		.find({"user":req.user._id})
		.sort('-created_at')
		.exec(function(err, alerts) {
			if (err) {
				return res.status(500).send({
					message: err
				});
			} else {
				res.jsonp(alerts);
			}
		});
};

exports.listByClass = function(req, res) {
	Alert
		.find()
		.populate('user')
		.exec(function(err, alerts) {
			if (err) {
				return res.status(500).send({
					message: err
				});
			} else {
				var xxx = _.filter(alerts, function(a) { 	
					return a.user.classroom+'' === req.params['classroomId']; 
				});

				return res.jsonp(xxx);
			}
	});
};

/**
 * Alert middleware
 */
exports.alertByID = function(req, res, next, id) {
	Alert.findById(id).exec(function(err, alert) {
		if (err) return next(err);
		if (!alert) return next(new Error('Failed to load notification ' + id));
		req.alert = alert;
		next();
	});
};
