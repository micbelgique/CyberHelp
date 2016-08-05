'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
	Classroom = require('../../models/classroom.js'),
	_ = require('lodash');

/**
 * Create a customer
 */
exports.create = function(req, res) {
	var classroom = new Classroom(req.body);
	
	classroom.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			req.school.classrooms.push(classroom);
			req.school.save(function(err){
				if (err) 
					return res.status(400).send({ message: err });
				 else 
				 	return res.jsonp(classroom);
			});
		}
	});
};

/**
 * Show the current classroom
 */
exports.read = function(req, res) {
	res.jsonp(req.classroom);
};

/**
 * Update a classroom
 */
exports.update = function(req, res) {
	var classroom = req.classroom;

	classroom = _.extend(classroom, req.body);

	classroom.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			res.jsonp(classroom);
		}
	});
};

/**
 * Delete a classroom
 */
exports.delete = function(req, res) {

	var classroom = req.classroom;

	classroom.remove(function(err) {
		if (err) {
			return res.status(400).send({ message: err });
		} else {
			res.jsonp(classroom);
		}
	});
};

/**
 * List of Classrooms
 */
exports.list = function(req, res) {
	Classroom
		.find({})
		.sort('-created')
		.populate('user')
		.exec(function(err, classrooms) {
			if (err) {
				return res.status(500).send({
					message: err
				});
			} else {
				res.jsonp(classrooms);
			}
		});
};


/**
 * Classroom middleware
 */
exports.classroomByID = function(req, res, next, id) {
	Classroom.findById(id).exec(function(err, classroom) {
		if (err) return next(err);
		if (!classroom) return next(new Error('Failed to load notification ' + id));
		req.classroom = classroom;
		next();
	});
};
