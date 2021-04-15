require("dotenv").config()
const jwt = require("jsonwebtoken")

function authenticate(request, response, next) {
	const token = request.header("x-auth-token")
	if (!token)
		return response.status(401).send({
			status: 401,
			message: "Access denied. Token not found!",
		})
	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY)
		request.user = decoded
		next()
	} catch (exception) {
		response.status(400).send({
			status: 400,
			message: "Invalid authentication token provided",
		})
	}
}

module.exports = authenticate
