'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
	School = require('../../models/school.js'),
	_ = require('lodash');

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
			return res.jsonp(school);
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
