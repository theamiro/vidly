require("dotenv").config()
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const {Schema, model} = mongoose

const userSchema = Schema({
	name: {
		type: String,
		required: true,
		minLength: 2,
		maxLength: 255,
	},
	email: {
		type: String,
		required: true,
		pattern: /^[A-Z0-9a-z._%+-]+@[A-Z0-9.-]+\.[A-Za-z]{2,4}$/,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
})

userSchema.methods.generateAuthToken = function () {
	return jwt.sign(
		{_id: this.id, name: this.name, email: this.email},
		process.env.SECRET_KEY
	)
}

const User = model("User", userSchema)

module.exports = User
module.exports.userSchema = userSchema
