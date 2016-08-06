'use strict';

module.exports = function(app) {
	var alerts = require('../../controllers/_api/alerts');
	var members = require('../../controllers/members');

	app.route('/api/alerts')
		.get(members.isAuthApi, alerts.list)
		.post(members.isAuthApi, alerts.create);

	app.route('/api/alerts/classroom/:classroomId')
		.get(alerts.listByClass);

	app.route('/api/alerts/:alertId')
		.get(alerts.read)
		.put(members.isAuthApi, alerts.update)
		.delete(members.isAuthApi, alerts.delete);

	app.param('alertId', alerts.alertByID);
}
