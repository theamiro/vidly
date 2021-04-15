const debug = require("debug")("app:startup")
const winston = require("winston")
module.exports = function (error, request, response, next) {
	winston.error(error.message, error)
	debug(error.message)
	response.status(500).send({
		status: 500,
		message:
			"Something went wrong, It's not you it is us! We are working on it, probably. 🙈",
	})
}
