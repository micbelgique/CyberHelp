
'use strict';

module.exports = function(app) {
	var home = require('../controllers/home');
	var members = require('../controllers/members');

	app.route('/')
		.get(home.root);

	app.route('/:lng(fr|nl|en)/')
		.get(home.index);

	app.route('/:lng(fr|nl|en)/testing')
		.get(home.testing);

	app.route('/:lng(fr|nl|en)/testing2')
		.get(home.testing2);

	app.route('/:lng(fr|nl|en)/customers')
		.get(members.isAuth, home.customers);

	app.route('/:lng(fr|nl|en)/products')
		.get(members.isAuth, home.products);

	app.route('/:lng(fr|nl|en)/rewards')
		.get(members.isAuth, home.rewards);

	app.route('/:lng(fr|nl|en)/privacy_policy')
		.get(home.privacy)

	app.route('/:lng(fr|nl|en)/404').get(home.notFound);
	app.route('/:lng(fr|nl|en)/505').get(home.error505);
}
