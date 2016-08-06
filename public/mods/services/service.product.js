'use strict';

// Customer service used for communicating with Customers REST endpoints
angular.module('crm_app').factory('Product', ['$resource',
	function($resource) {
		return $resource('/api/products/:productId', {
			productId: '@_id'
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
