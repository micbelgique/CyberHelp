/*
  Author : Joao Pinto
   - pinto.joao@outlook.com

  based on the work of phildow from OK CODERS
      -> https://github.com/okcoders
*/

'use strict';
var passport = require('passport');

module.exports = function(app) {
	var members = require('../../controllers/_api/members');

	app.route('/api/members/login')
		.post(members.loginPost);
}
