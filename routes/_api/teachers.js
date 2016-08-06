'use strict';

module.exports = function(app) {
	var teachers = require('../../controllers/_api/teachers');
	// var classrooms = require('../../controllers/_api/classrooms');
	// var students = require('../../controllers/_api/students');
	// var members = require('../../controllers/members');
	// var membersApi = require('../../controllers/_api/members');

	app.route('/api/teachers')
		.get( teachers.list)
		.post( teachers.create);

	// app.route('/api/teachers/:teacherId')
	// 	.get(teachers.read)
	// 	.put(members.isAuthApi, teachers.update)
	// 	.delete(members.isAuthApi, teachers.delete);

	// app.route('/api/teachers/:teacherId/classrooms')
	// 	.get(members.isAuthApi, classrooms.list)
	// 	.post(members.isAuthApi, classrooms.create);

	// app.route('/api/teachers/:teacherId/classrooms/:classroomId')
	// 	.get(classrooms.read)
	// 	.put(members.isAuthApi, classrooms.update)
	// 	.delete(members.isAuthApi, classrooms.delete);

	// app.route('/api/teachers/:teacherId/classrooms/:classroomId/students')
	// 	.get(classrooms.getStudents);

	// app.route('/api/teachers/:teacherId/classrooms/:classroomId/students/:userId')
	// 	.post(classrooms.associateStudent);


	// app.param('teacherId', teachers.schoolByID);
	// app.param('classroomId', classrooms.classroomByID);
	// app.param('userId', membersApi.userById);
}
