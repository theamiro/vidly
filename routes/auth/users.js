const _ = require("lodash")
const express = require("express")
const router = express.Router()
const debug = require("debug")("app:startup")
const User = require("../../models/User")
const bcrypt = require("bcrypt")

router.use(express.json())

router.get("/", (request, response) => {
	getUsers()
		.then((users) => {
			response.send({
				status: 200,
				message: "Fetched users successfully",
				users: users,
			})
		})
		.catch((error) => {
			response.send(error)
		})
})

router.get("/:id", (request, response) => {
	getUserByID(request.params.id)
		.then((user) => {
			response.send({
				status: 200,
				message: "Fetched user successfully",
				user: user,
			})
		})
		.catch((error) => {
			response.status(404).send(error)
		})
})

router.post("/", (request, response) => {
	debug(request.body)
	createUser(request.body)
		.then((result) => {
			response.send({
				status: 200,
				message: "User created succesfully",
				customer: result,
			})
		})
		.catch((error) => {
			response.send(error)
		})
})

async function getUsers() {
	try {
		const users = await User.find()
		if (users.length) {
			return Promise.resolve(_.pick(users, ["_id", "name", "email"]))
		} else {
			return Promise.reject(new Error("Couldn't find any users"))
		}
	} catch (error) {
		return Promise.reject(error)
	}
}

async function getUserByID(id) {
	try {
		const user = await User.findById(id)
		if (user) {
			return Promise.resolve(_.pick(user, ["_id", "name", "email"]))
		} else {
			return new Error(`Couldn't find the user with the ID ${id}`)
		}
	} catch (error) {
		return Promise.reject(error)
	}
}

async function createUser(body) {
	try {
		var user = await User.findOne({email: body.email})
		if (user) {
			return Promise.resolve(new Error("User already exists"))
		}
		user = new User(_.pick(body, ["name", "email", "password"]))
		const salt = await bcrypt.genSalt()
		user.password = await bcrypt.hash(user.password, salt)
		debug(user)
		const result = await user.save()
		if (result) {
			return Promise.resolve(_.pick(result, ["_id", "name", "email"]))
		} else {
			return Promise.reject(new Error("Failed to create user"))
		}
	} catch (error) {
		debug(error)
		return Promise.reject(error)
	}
}
module.exports = router
