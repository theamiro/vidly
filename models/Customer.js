const mongoose = require("mongoose")
const {Schema} = mongoose

const Customer = mongoose.model(
	"Customer",
	new Schema({
		name: {
			type: String,
			required: true,
			minLength: 2,
			maxLength: 50,
		},
		isGold: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
			minLength: 10,
			maxLength: 13,
		},
	})
)

module.exports = Customer
