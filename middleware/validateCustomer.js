const Joi = require("joi")

const customerSchema = Joi.object({
	name: Joi.string()
		.min(2)
		.max(20)
		.pattern(/^[A-Za-z\s]{2,}$/),
	isGold: Joi.boolean(),
	phone: Joi.string().pattern(
		/^(?:\+\d{1,3}|0\d{1,3}|00\d{1,2})?(?:\s?\(\d+\))?(?:[-\/\s.]|\d)+$/
	),
})

module.exports = customerSchema

// Email: /^[A-Z0-9a-z._%+-]+@[A-Z0-9.-]+\.[A-Za-z]{2,4}$/
// Name: /^[A-Za-z\s]{2,}$/
// Phone: /^(?:\+\d{1,3}|0\d{1,3}|00\d{1,2})?(?:\s?\(\d+\))?(?:[-\/\s.]|\d)+$/
