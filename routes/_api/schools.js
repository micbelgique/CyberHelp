'use strict';

module.exports = function(app) {
	var schools = require('../../controllers/_api/schools');
	var classrooms = require('../../controllers/_api/classrooms');
	var students = require('../../controllers/_api/students');
	var members = require('../../controllers/members');
	var membersApi = require('../../controllers/_api/members');

	app.route('/api/schools')
		.get( schools.list)
		.post( schools.create);

	app.route('/api/schools/:schoolId')
		.get(schools.read)
		.put(members.isAuthApi, schools.update)
		.delete(members.isAuthApi, schools.delete);

	app.route('/api/schools/:schoolId/classrooms')
		.get( classrooms.list)
		.post( classrooms.create);

	app.route('/api/schools/:schoolId/classrooms/:classroomId')
		.get(classrooms.read)
		.put( classrooms.update)
		.delete( classrooms.delete);

	app.route('/api/schools/:schoolId/classrooms/:classroomId/students')
		.get(classrooms.getStudents);

	app.route('/api/schools/:schoolId/classrooms/:classroomId/students/:userId')
		.post(classrooms.associateStudent);


	app.param('schoolId', schools.schoolByID);
	app.param('classroomId', classrooms.classroomByID);
	app.param('userId', membersApi.userById);
}
