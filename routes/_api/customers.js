'use strict';

module.exports = function(app) {
	var customers = require('../../controllers/_api/customers');
	var members = require('../../controllers/members');

	app.route('/api/customers')
		.get(members.isAuthApi, customers.list)
		.post(members.isAuthApi, customers.create);

	app.route('/api/customers/:customerId')
		.get(customers.read)
		.put(members.isAuthApi, customers.update)
		.delete(members.isAuthApi, customers.delete);

	app.param('customerId', customers.customerByID);
}
