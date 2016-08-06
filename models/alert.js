var mongoose = require('mongoose');

var schema = mongoose.Schema({
	alertType: {
		type: {
			type: Number,
			enum: [1, 2, 3]
		}
	},
	status: {
		type: String,
		// enum: ['open', 'accepted', 'inprogress', 'closed']
		default: 'open'
	},
	message: String,
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	}
});

var Alert = mongoose.model('Alert', schema);
module.exports = Alert;