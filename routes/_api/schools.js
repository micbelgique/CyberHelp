'use strict';

module.exports = function(app) {
	var schools = require('../../controllers/_api/schools');
	var classrooms = require('../../controllers/_api/classrooms');
	var members = require('../../controllers/members');

	app.route('/api/schools')
		.get(members.isAuthApi, schools.list)
		.post(members.isAuthApi, schools.create);

	app.route('/api/schools/:schoolId')
		.get(schools.read)
		.put(members.isAuthApi, schools.update)
		.delete(members.isAuthApi, schools.delete);

	app.route('/api/schools/:schoolId/classrooms')
		.get(members.isAuthApi, classrooms.list)
		.post(members.isAuthApi, classrooms.create);

	app.route('/api/schools/:schoolId/classrooms/:classroomId')
		.get(classrooms.read)
		.put(members.isAuthApi, classrooms.update)
		.delete(members.isAuthApi, classrooms.delete);

	app.param('schoolId', schools.schoolByID);
	app.param('classroomId', classrooms.classroomByID);
}
