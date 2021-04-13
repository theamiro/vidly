const Joi = require("joi")

const genreSchema = Joi.object({
	name: Joi.string()
		.min(3)
		.max(20)
		.pattern(/^[A-Za-z\s]+$/),
	description: Joi.string().max(144),
})

module.exports = genreSchema
