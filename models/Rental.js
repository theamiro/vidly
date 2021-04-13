const mongoose = require("mongoose")
const {Schema} = mongoose

const rentalSchema = Schema({
	customer: {
		type: Schema({
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
		}),
		required: true,
	},
	movie: {
		type: Schema({
			title: {
				type: String,
				trim: true,
				minLength: 2,
				maxLength: 20,
			},
			numberInStock: {
				type: Number,
				min: 1,
			},
			dailyRentalRate: {
				type: Number,
				default: 30,
				min: 1,
			},
		}),
		required: true,
	},
	dateRented: {
		type: Date,
		default: Date.now,
	},
	dateReturned: {
		type: Date,
	},
	rentalFee: {
		type: Number,
		min: 1,
	},
})

const Rental = mongoose.model("Rental", rentalSchema)

module.exports = Rental
module.exports.rentalSchema = rentalSchema
