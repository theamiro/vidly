const mongoose = require("mongoose")
const {Schema, model} = mongoose

const customerSchema = Schema({
	name: {
		type: String,
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

const Customer = model("Customer", customerSchema)

module.exports = Customer
module.exports.customerSchema = customerSchema
