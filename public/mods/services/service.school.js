'use strict';

angular.module('crm_app').factory('School', ['$resource',
	function($resource) {
		return $resource('/api/schools/:schoolId', {
			schoolId: '@_id'
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
