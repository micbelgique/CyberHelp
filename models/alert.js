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
	},
	created_at :{
		type: Date,
		default:Date.now
	},
	ionicToken : String
});

var Alert = mongoose.model('Alert', schema);
module.exports = Alert;




// JWT eyJhbGciOiJIUzI1NiJ9.c3R1ZGVudEBjeWJlci5jb20.UGSURW-qNoyrPLXXBpzBkypMJBQ0wdwQnQwVTtykHNo