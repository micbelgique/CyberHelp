'use strict';

angular.module('crm_app').factory('Teacher', ['$resource',
	function($resource) {
		return $resource('/api/teachers/:teacherId', {
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
