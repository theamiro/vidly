const auth = require("../../middleware/auth")
const isAdmin = require("../../middleware/admin")
const _ = require("lodash")
const express = require("express")
const router = express.Router()
const debug = require("debug")("app:startup")
const User = require("../../models/User")
const bcrypt = require("bcrypt")

router.use(express.json())

router.get("/", [auth, isAdmin], async (request, response) => {
	const users = await User.find()
	if (users.length) {
		response.status(200).send({
			status: 200,
			message: "Users found",
			users: _.map(
				users,
				_.partialRight(_.pick, ["id", "name", "email"])
			),
		})
	} else {
		response.status(404).send({
			status: 404,
			message: "Users could not be found",
		})
	}
})

router.get("/me", auth, async (request, response) => {
	debug(request.user)
	const user = await User.findById(request.user.id)
	if (user) {
		response.status(200).send({
			status: "200",
			message: "User found",
			user: _.pick(user, ["id", "name", "email"]),
		})
	} else {
		response.status(404).send({
			status: 404,
			message: "User could not be found",
		})
	}
})

router.get("/:id", auth, async (request, response) => {
	const user = await User.findById(request.params.id)
	if (user) {
		response.status(200).send({
			status: 200,
			message: "User found",
			user: _.pick(user, ["id", "name", "email"]),
		})
	} else {
		response.status(404).send({
			status: 404,
			message: "User could not be found",
		})
	}
})

router.post("/", async (request, response) => {
	var user = await User.findOne({email: request.body.email})
	if (user) {
		return response.status(400).send({
			status: 400,
			message: "User already exists",
		})
	}

	user = new User(_.pick(request.body, ["name", "email", "password"]))

	const salt = await bcrypt.genSalt()
	user.password = await bcrypt.hash(user.password, salt)
	debug(user)
	const result = await user.save()

	if (result) {
		const token = user.generateAuthToken()
		response
			.header("x-auth-token", token)
			.status(201)
			.send({
				status: 201,
				message: "User created successfully",
				user: _.pick(result, ["id", "name", "email"]),
			})
	} else {
		response.status(500).send({
			status: 500,
			message: "Something went wrong ",
		})
	}
})

module.exports = router
