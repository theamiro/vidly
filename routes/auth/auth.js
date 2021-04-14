const _ = require("lodash")
const express = require("express")
const router = express.Router()
const debug = require("debug")("app:startup")
const User = require("../../models/User")
const bcrypt = require("bcrypt")

router.use(express.json())

router.post("/", (request, response) => {
	authenticate(request.body)
		.then((isValid) => {
			debug(isValid)
			response.status(200).send({
				status: 200,
				message: `${request.body.email} logged in successfully`,
			})
		})
		.catch((error) => {
			response.status(400).send({
				status: 400,
				message: `${error}`,
			})
		})
})

async function authenticate(body) {
	try {
		const user = await User.findOne({email: body.email})
		if (!user) {
			return Promise.resolve(new Error("Invalid Email or Password"))
		}
		const isValidPassword = await bcrypt.compare(
			body.password,
			user.password
		)

		if (isValidPassword) {
			return Promise.resolve(true)
		} else {
			return Promise.reject(new Error("Invalid Email or Password"))
		}
	} catch (error) {
		debug(error)
		return Promise.reject(new Error("Invalid Email or Password"))
	}
}

module.exports = router
