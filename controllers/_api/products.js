'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
	Product = require('../../models/product.js'),
	_ = require('lodash');

/**
 * Create a customer
 */
exports.create = function(req, res) {

	var product = new Product(req.body);
	product.user = req.user;

	product.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			return res.jsonp(product);
		}
	});
};

/**
 * Show the current product
 */
exports.read = function(req, res) {
	res.jsonp(req.product);
};

/**
 * Update a product
 */
exports.update = function(req, res) {
	var product = req.product;

	product = _.extend(product, req.body);

	product.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			res.jsonp(product);
		}
	});
};

/**
 * Delete a product
 */
exports.delete = function(req, res) {

	var product = req.product;

	product.remove(function(err) {
		if (err) {
			return res.status(400).send({ message: err });
		} else {
			res.jsonp(product);
		}
	});
};

/**
 * List of Products
 */
exports.list = function(req, res) {
	Product
		.find({})
		.sort('-created')
		.populate('user')
		.exec(function(err, products) {
			if (err) {
				return res.status(500).send({
					message: err
				});
			} else {
				res.jsonp(products);
			}
		});
};


/**
 * Product middleware
 */
exports.productByID = function(req, res, next, id) {
	Product.findById(id).exec(function(err, product) {
		if (err) return next(err);
		if (!product) return next(new Error('Failed to load notification ' + id));
		req.product = product;
		next();
	});
};
