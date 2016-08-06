'use strict';

var classroomId = $('#classroomId').val();

angular.module('crm_app').factory('Alert', ['$resource',
	function($resource) {
		return $resource('/api/alerts/classroom/'+classroomId+'/:alertId', {
			alertId: '@_id'
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
