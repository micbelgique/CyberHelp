'use strict';

module.exports = function(app) {
	var products = require('../../controllers/_api/products');
	var members = require('../../controllers/members');

	app.route('/api/products')
		.get(members.isAuthApi, products.list)
		.post(members.isAuthApi, products.create);

	app.route('/api/products/:productId')
		.get(products.read)
		.put(members.isAuthApi, products.update)
		.delete(members.isAuthApi, products.delete);

	app.param('productId', products.productByID);
}
