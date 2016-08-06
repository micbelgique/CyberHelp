'use strict';

var schoolId = $('#schoolId').val();

angular.module('crm_app').factory('Classroom', ['$resource',
	function($resource) {
		return $resource('/api/schools/'+schoolId+'/classrooms', {
			classroomId: '@_id'
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
