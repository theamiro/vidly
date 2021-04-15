require("dotenv").config()
const jwt = require("jsonwebtoken")

function authorize(request, response, next) {
	if (!request.user.isAdmin) {
		return response.status(403).send({
			status: 403,
			message:
				"Access denied. You do not have permission to access this!",
		})
	}
	next()
}

module.exports = authorize
