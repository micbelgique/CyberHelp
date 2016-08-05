'use strict';

module.exports = function(app) {
	var secrets = require('../controllers/secrets');
	var members = require('../controllers/members');

	app.route('/:lng(fr|nl|en)/secrets')
		.get(members.isAuth, members.hasAuthorization(['admin']), secrets.index);
}
