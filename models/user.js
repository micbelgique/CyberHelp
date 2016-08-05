/*
  Author : Joao Pinto
   - pinto.joao@outlook.com

  based on the work of phildow from OK CODERS
      -> https://github.com/okcoders
*/

var mongoose = require('mongoose')
require('mongoose-moment')(mongoose);

var bcrypt = require('bcrypt');

var schema = mongoose.Schema({
	email: {type: String, required: true, trim: true, unique: true},
	password: {type: String, required: false},
	activated : {type: Boolean, default: false},
	secret: {type: String, default: null},
	jwttoken: {type: String, default: null},
	first_name: {type: String, default: null},
	last_name: {type: String, default: null},
	gender: {type: String, default: null},
	age: {type: Number, default: null},
	school: {type: String, default:null},
	currentYear: {type: Number, default: 1},

  roles: {
		type: [{
			type: String,
			enum: ['student', 'director', 'teacher', 'super_admin']
		}],
		default: ['student']
  }
});

schema.methods.generateHash = function (password) {
	 return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

schema.methods.isValidPassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', schema);
module.exports = User;
