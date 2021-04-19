const mongoose = require("mongoose")
const {Schema, model} = mongoose

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

genreSchema.virtual("links").get(function () {
	return {
		self: `${
			process.env.BASE_URL + "/api/genres/" + this._id.toHexString()
		}`,
		collection: `${process.env.BASE_URL + "/api/genres"}`,
	}
})

genreSchema.set("toJSON", {
	virtuals: true,
})

const Genre = model("Genre", genreSchema)

module.exports = Genre
module.exports.genreSchema = genreSchema
