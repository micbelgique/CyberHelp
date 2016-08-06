'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
	Alert = require('../../models/alert.js'),
	Classroom = require('../../models/classroom.js'),
	_ = require('lodash');

/**
 * Create a customer
 */
exports.create = function(req, res) {
	var alert = new Alert(req.body);
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

	alert.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			res.jsonp(alert);
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
	Alert
		.find({})
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
