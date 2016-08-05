'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
	User = require('../../models/user.js'),
	_ = require('lodash');

exports.create = function(req, res) {
	var user = new User(req.body);

	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			return res.jsonp(user);
		}
	});
};

/**
 * Show the current user
 */
exports.read = function(req, res) {
	res.jsonp(req.user);
};

/**
 * Update a user
 */
exports.update = function(req, res) {
	var user = req.user;

	user = _.extend(user, req.body);

	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			res.jsonp(user);
		}
	});
};

/**
 * Delete a user
 */
exports.delete = function(req, res) {

	var user = req.user;

	user.remove(function(err) {
		if (err) {
			return res.status(400).send({ message: err });
		} else {
			res.jsonp(user);
		}
	});
};

/**
 * List of Users
 */
exports.list = function(req, res) {
	User
		.find({})
		.sort('-created')
		// .populate('classrooms')
		.exec(function(err, users) {
			if (err) {
				return res.status(500).send({
					message: err
				});
			} else {
				res.jsonp(users);
			}
		});
};


/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	User.findById(id).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load notification ' + id));
		req.user = user;
		next();
	});
};
