const mongoose = require("mongoose")
const {Schema} = mongoose

const Genre = mongoose.model(
	"Genre",
	new Schema({
		name: {
			type: String,
			required: true,
			minLength: 4,
			maxLength: 20,
		},
		description: {
			type: String,
		},
	})
)

module.exports = Genre
