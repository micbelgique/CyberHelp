'use strict';

module.exports = function(app) {
	var classrooms = require('../../controllers/_api/classrooms');
	var members = require('../../controllers/members');

	app.route('/api/classrooms')
		.get(members.isAuthApi, classrooms.list)
		.post(members.isAuthApi, classrooms.create);

	app.route('/api/classrooms/:classroomId')
		.get(classrooms.read)
		.put(members.isAuthApi, classrooms.update)
		.delete(members.isAuthApi, classrooms.delete);

	app.param('classroomId', classrooms.classroomByID);
}
