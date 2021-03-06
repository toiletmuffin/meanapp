const mongoose = require('mongoose');

//Customer Schema
const CustomerSchema = mongoose.Schema({
  name: {
		type: String,
    required: true
	},
	rentalId: [mongoose.Schema.Types.ObjectId],
	info: String,
  created: Date,
  discount: Number
});

const Customer = module.exports = mongoose.model('Customer', CustomerSchema);
