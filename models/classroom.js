var mongoose = require('mongoose');

var schema = mongoose.Schema({
	year: {
		type: Number,
		require: true,
		trim: true
	},
	name: {
		type: String,
		require: true,
		trim: true
	},
	prof: {
		type: String,
		require: true,
		trim: true
	},
	users: [{
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	}]
});


var Classrooms = mongoose.model('Classrooms', schema);
module.exports = Classrooms;
