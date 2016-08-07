'use strict';

module.exports = function(app) {
	var alerts = require('../../controllers/_api/alerts');
	var members = require('../../controllers/members');
	var passport = require('passport');

	app.route('/api/alerts')
		.get(passport.authenticate('jwt', { session: true}), alerts.list)
		.post(passport.authenticate('jwt', { session: true}), alerts.create);

	app.route('/api/alerts/classroom/:classroomId')
		.get(passport.authenticate('jwt', { session: true}), alerts.listByClass);

	app.route('/api/alerts/:alertId')
		.get(alerts.read)
		.put(members.isAuthApi, alerts.update)
		.delete(members.isAuthApi, alerts.delete);

	app.param('alertId', alerts.alertByID);
}
