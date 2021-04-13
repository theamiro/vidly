const mongoose = require("mongoose")
const {genreSchema} = require("./Genre")
const {Schema} = mongoose

const movieSchema = Schema({
	title: {
		type: String,
		trim: true,
		minLength: 2,
		maxLength: 20,
	},
	year: {
		type: Number,
		min: [1900, "I don't think there were cameras back then!"],
		max: new Date().getFullYear(),
	},
	genre: genreSchema,
	numberInStock: {
		type: Number,
		min: 1,
	},
	dailyRentalRate: {
		type: Number,
		default: 30,
		min: 1,
	},
})
const Movie = mongoose.model("Movie", movieSchema)

module.exports = Movie
module.exports.movieSchema = movieSchema
