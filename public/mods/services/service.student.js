'use strict';

var schoolId = $('#schoolId').val();
var classroomId = $('#classroomId').val();

angular.module('crm_app').factory('Student', ['$resource',
	function($resource) {
		return $resource('/api/schools/'+schoolId+'/classrooms/'+classroomId+'/students/:studentId', {
			studentId: '@_id'
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
