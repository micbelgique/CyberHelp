var mongoose = require('mongoose');


var schema = mongoose.Schema({
	type: {
		type: String,
	},
	name: {
		type: String,
		require: true,
		trim: true
	},
	price: {
		type: Number,
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	}
});


var Product = mongoose.model('Product', schema);
module.exports = Product;
