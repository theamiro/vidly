const mongoose = require("mongoose")
const {Schema} = mongoose

const genreSchema = Schema({
	name: {
		type: String,
		minLength: 4,
		maxLength: 20,
	},
	description: {
		type: String,
	},
})

const Genre = mongoose.model("Genre", genreSchema)

module.exports = Genre
module.exports.genreSchema = genreSchema
