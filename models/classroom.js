var mongoose = require('mongoose');

var schema = mongoose.Schema({
	name: {
		type: String,
		require: true,
		trim: true
	}
});


var Classrooms = mongoose.model('Classrooms', schema);
module.exports = Classrooms;
