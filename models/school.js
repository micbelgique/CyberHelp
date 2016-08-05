var mongoose = require('mongoose');

var schema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	address: {
		type: String,
		required: false
	},
	zipcode: {
		type: Number,
		min: 1000,
		max: 9999,
		'default': ''
	},
	city: String,
	created: {
		type: Date,
		default: Date.now
	},
	classrooms: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Classrooms'
	}]
});


var School = mongoose.model('School', schema);
module.exports = School;
