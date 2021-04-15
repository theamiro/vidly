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
	isAdmin: {
		type: Boolean,
	},
})

userSchema.virtual("id").get(function () {
	return this._id.toHexString()
})

userSchema.set("toJSON", {
	virtuals: true,
})

userSchema.methods.generateAuthToken = function () {
	return jwt.sign(
		{
			id: this.id,
			name: this.name,
			email: this.email,
			isAdmin: this.isAdmin,
		},
		process.env.SECRET_KEY
	)
}

const User = model("User", userSchema)

module.exports = User
module.exports.userSchema = userSchema
