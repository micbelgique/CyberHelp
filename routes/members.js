/*
  Author : Joao Pinto
   - pinto.joao@outlook.com

  based on the work of phildow from OK CODERS
      -> https://github.com/okcoders
*/

'use strict';
var passport = require('passport');


module.exports = function(app) {
	var members = require('../controllers/members');

app.get('/profile', passport.authenticate('jwt', { session: false}),
    function(req, res) {
        res.send(req.user);
    }
);

	app.route('/:lng(fr|nl|en)/members/errorfblogin')
		.get(members.errorfblogin)

	app.route('/:lng(fr|nl|en)/members/fixfbuser')
		.post(members.fixfbuser);

	app.route('/:lng(fr|nl|en)/members/validation/:userId/:secret')
		.get(members.validationPoints)

	app.route('/api/users/updatedevice')
		.put(passport.authenticate('jwt', { session: false}), members.updateDevice);

	app.route('/api/users/update_category')
		.put(passport.authenticate('jwt', { session: false}), members.updateCategory);

	app.route('/api/users/pot')
		.get(passport.authenticate('jwt', {session:false}), members.getPot);


	//todelete
	app.route('/users')
		.get(members.isAuth, members.list);

	app.route('/:lng(fr|nl|en)/members/login')
		.get(members.login)
		.post(members.loginPost);


	app.route('/:lng(fr|nl|en)/members/uninstall').get(members.uninstall).post(members.uninstallPost);
	app.route('/:lng(fr|nl|en)/members/uninstall/:token').get(members.uninstall);


	app.route('/:lng(fr|nl|en)/members/loggedfb2')
		.get(members.loggedfb2)
		.post(members.registerPost);

	app.route('/members/registerLang').get(members.registerLang);
	app.route('/:lng(fr|nl|en)/members/register')
		.post(members.registerPost);

	app.route('/:lng(fr|nl|en)/members/register_smile')
		.get(members.register_smile);

	app.route('/:lng(fr|nl|en)/members/logout')
		.get(members.logout);

	app.route('/:lng(fr|nl|en)/members/forgotpassword')
		.get(members.forgotpassword)
		.post(members.forgotpasswordPost);

	app.route('/:lng(fr|nl|en)/members/updatepwd-confirmation/:secret')
		.get(members.updatepwd);

	app.route('/:lng(fr|nl|en)/members/new-password')
		.post(members.newpassword);


	app.route('/:lng(fr|nl|en)/members/confirmationfb')
		.get(members.confirmation_facebook)

}
