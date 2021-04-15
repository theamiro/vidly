const express = require("express")
const router = express.Router()
const debug = require("debug")("app:startup")
const User = require("../../models/User")
const bcrypt = require("bcrypt")

router.use(express.json())

router.post("/", async (request, response) => {
	const user = await User.findOne({email: request.body.email})
	if (!user) {
		return response.status(400).send({
			status: 400,
			message: "Invalid email or password",
		})
	}
	const isValidPassword = await bcrypt.compare(
		request.body.password,
		user.password
	)

	if (!isValidPassword)
		return response.status(400).send({
			status: 400,
			message: "Invalid email or password",
		})

	const token = user.generateAuthToken()
	debug(user)
	response.header("x-auth-token", token).status(200).send({
		status: 200,
		message: "Login successful",
		token: token,
	})
})

module.exports = router
