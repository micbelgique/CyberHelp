'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
	Classroom = require('../../models/classroom.js'),
	School = require('../../models/school.js'),
	User = require('../../models/user.js'),
	_ = require('lodash');

var jwt = require('jsonwebtoken');
var settings = require('../../config/settings');

/**
 * Create a customer
 */
exports.create = function(req, res) {
	console.log(req.body)
	var classroom = new Classroom(req.body);
	classroom.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			console.log(classroom);
			req.school.classrooms.push(classroom);
			req.school.save();
	 		
	 		var _u = {
				email: req.body.email,
				password: req.body.password,
				roles: ['teacher']
			}

			var user = new User(_u);
			
			user.password = user.generateHash(req.body.password);
			var token = jwt.sign(user.email, settings.jwtSecret, {
			  expiresIn: settings.expiresTimeJwt // in seconds
			});
			user.jwttoken = 'JWT ' + token;

			user.classroom = classroom;
			user.school = req.school;

			console.log(' ')
			console.log(user);
			console.log(' -- ');
			user.save(function(err) {
				if (err) {
					console.log(err);
					return res.status(400).send({
						message: err
					});
				} else {
					classroom.users.push(user)
					classroom.save(function(err){
						return res.jsonp(user);
					})
				}
			});
		}
	});
};


exports.createStudent = function(req, res) {
	
	console.log('create student')
	console.log(req.body);

	var user = new User(req.body);
	
	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			req.classroom.users.push(user)
			req.classroom.save(function(err){
				return res.jsonp(user);
			})
		}
	});
}

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
	School.populate(req.school, {path:"classrooms"}, function(err, school) {
		res.jsonp(school.classrooms);
	});
};

exports.getStudents = function(req, res) {
	var cr = req.params['classroomId'];
	School.populate(req.school, {path:"classrooms"}, function(err, school) {

		var clsroom = _.filter(school.classrooms, function(c) { 	
			return c._id+'' === cr; 
		});
		if(clsroom){
			Classroom.populate(clsroom[0], {path: 'users'}, function(err, classroom){
				if(err) return res.status(500).send({ message: err });
				else{
					return res.jsonp(classroom.users);
				}
			})
		}
		else
			return res.jsonp(clsroom);
	});
}

exports.associateStudent = function(req, res) {	
	var classroom = req.classroom;
	classroom.users.push(req.user);
	classroom.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			res.jsonp(req.user);
		}
	});
}

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
