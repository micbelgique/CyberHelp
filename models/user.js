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
	last: 'Moment',
	email: {type: String, require: true, trim: true, unique: true},
	password: {type: String, require: false},
	activated : {type: Boolean, default: false},
	secret: {type: String, default: null},
	picture: {type: String, default: null},
	jwttoken: {type: String, default: null},
	name: {type: String, default: null},
	first_name: {type: String, default: null},
	last_name: {type: String, default: null},
	gender: {type: String, default: null},
	age: {type: Number, default: null},
	local: {type: String, default: null},
	facebookId:{type:String, default: null},
	country: {type:String, default: null},
	browser: {type:String, default: null},
	os: {type:String, default: null},
	version: {type: String},

  roles: {
		type: [{
			type: String,
			enum: ['student', 'admin', 'teacher']
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
