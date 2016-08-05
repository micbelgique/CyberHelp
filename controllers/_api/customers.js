'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
	Customer = require('../../models/customer.js'),
	_ = require('lodash');

/**
 * Create a customer
 */
exports.create = function(req, res) {

	var customer = new Customer(req.body);

	customer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			return res.jsonp(customer);
		}
	});
};

/**
 * Show the current customer
 */
exports.read = function(req, res) {
	res.jsonp(req.customer);
};

/**
 * Update a customer
 */
exports.update = function(req, res) {
	var customer = req.customer;

	customer = _.extend(customer, req.body);

	customer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			res.jsonp(customer);
		}
	});
};

/**
 * Delete a customer
 */
exports.delete = function(req, res) {

	var customer = req.customer;

	customer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			res.jsonp(customer);
		}
	});
};

/**
 * List of notifications
 */
exports.list = function(req, res) {
	Customer
		.find({})
		.sort('-created')
		.exec(function(err, customers) {
			if (err) {
				return res.status(500).send({
					message: err
				});
			} else {
				res.jsonp(customers);
			}
		});


};

// exports.getAll = function(req, res) {
// 	Customer
// 		.find()
// 		.sort('-created').populate('user')
// 		.exec(function(err, notifications) {
// 			if (err) {
// 				return res.status(400).send({
// 					message: errorHandler.getErrorMessage(err)
// 				});
// 			} else {
// 				return res.jsonp(notifications);
// 			}
// 		});
// }

/**
 * Notification middleware
 */
exports.customerByID = function(req, res, next, id) {
	Customer.findById(id).exec(function(err, customer) {
		if (err) return next(err);
		if (!customer) return next(new Error('Failed to load notification ' + id));
		req.customer = customer;
		next();
	});
};

/**
 * Notification authorization middleware
 */
// exports.hasAuthorization = function(req, res, next) {
// 	if (req.notification.user.id !== req.user.id) {
// 		return res.status(403).send({
// 			message: 'User is not authorized'
// 		});
// 	}
// 	next();
// };
