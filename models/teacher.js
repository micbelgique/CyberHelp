var mongoose = require('mongoose');

var schema = mongoose.Schema({
	first_name: {
		type: String,
		required: true,
		trim: true
	},
	last_name: {
		type: String,
		required: false
	}
});


var Teacher = mongoose.model('Teacher', schema);
module.exports = Teacher;
