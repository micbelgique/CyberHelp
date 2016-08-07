'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
	School = require('../../models/school.js'),
	User = require('../../models/user.js'),
	_ = require('lodash');

var jwt = require('jsonwebtoken');
var settings = require('../../config/settings');

/**
 * Create a customer
 */
exports.create = function(req, res) {
	var school = new School(req.body);

	school.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {

			var _u = {
				email: req.body.email,
				password: req.body.password,
				roles: ['director']
			}

			var user = new User(_u);

			user.password = user.generateHash(req.body.password);
			var token = jwt.sign(user.email, settings.jwtSecret, {
			  expiresIn: settings.expiresTimeJwt // in seconds
			});
			user.jwttoken = 'JWT ' + token;

			user.school = school;
			user.save(function(err) {
				return res.jsonp(school);	
			})
		}
	});
};

/**
 * Show the current school
 */
exports.read = function(req, res) {
	res.jsonp(req.school);
};

/**
 * Update a school
 */
exports.update = function(req, res) {
	var school = req.school;

	school = _.extend(school, req.body);

	school.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			res.jsonp(school);
		}
	});
};

/**
 * Delete a school
 */
exports.delete = function(req, res) {

	var school = req.school;

	school.remove(function(err) {
		if (err) {
			return res.status(400).send({ message: err });
		} else {
			res.jsonp(school);
		}
	});
};

/**
 * List of Schools
 */
exports.list = function(req, res) {
	School
		.find({})
		.sort('-created')
		// .populate('classrooms')
		.exec(function(err, schools) {
			if (err) {
				return res.status(500).send({
					message: err
				});
			} else {
				res.jsonp(schools);
			}
		});
};


/**
 * School middleware
 */
exports.schoolByID = function(req, res, next, id) {
	School.findById(id).exec(function(err, school) {
		if (err) return next(err);
		if (!school) return next(new Error('Failed to load notification ' + id));
		req.school = school;
		next();
	});
};
