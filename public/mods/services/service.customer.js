'use strict';

// Customer service used for communicating with Customers REST endpoints
angular.module('crm_app').factory('Customer', ['$resource',
	function($resource) {
		return $resource('/api/customers/:customerId', {
			customerId: '@_id'
		}, {
			update: {
				method: 'PUT',
				withCredentials: true
			},
			save: {
				method: 'POST',
				withCredentials: true
			},
			withCredentials: true
		});
	}
]);
