var mongoose = require('mongoose');


var schema = mongoose.Schema({
	name: {
		type: String,
		require: true,
		trim: true
	},
	address: {
		type: String,
		require: false
	},
	zipcode: {
		type: Number,
		min: 1000,
		max: 9999,
		'default': ''
	},
	city: String,
	VAT: {
		type: String,
		require: true,
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});


var Customer = mongoose.model('Customer', schema);
module.exports = Customer;
