const express = require("express")
const router = express.Router()
const debug = require("debug")("app:startup")
const Joi = require("Joi")
const mongoose = require("mongoose")

router.use(express.json())

mongoose
	.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		debug("Successfully connected to Mongo")
	})
	.catch((error) => {
		debug("Failed to connect to Mongo...", error)
	})

const customerSchema = mongoose.Schema({
	name: {
		type: "string",
		required: true,
		minLength: 2,
		maxLength: 50,
	},
	isGold: {
		type: "boolean",
		required: true,
	},
	phone: {
		type: "string",
		required: true,
		minLength: 10,
		maxLength: 13,
	},
})

const Customer = mongoose.model("Customer", customerSchema)

router.get("/", (request, response) => {
	getCustomers()
		.then((customers) => {
			response.send({
				status: 200,
				message: "Fetched customers successfully",
				customers: customers,
			})
		})
		.catch((error) => {
			response.send(error)
		})
})

router.post("/", (request, response) => {
	createCustomer(request.body)
		.then((result) => {
			response.send({
				status: 200,
				message: "Customer created succesfully",
				customer: result,
			})
		})
		.catch((error) => {
			response.send(error)
		})
})

router.put("/:id", (request, response) => {
	updateCustomer(request.params.id, request.body)
		.then((result) => {
			response.send({
				status: 200,
				message: "Customer updated succesfully",
				customer: result,
			})
		})
		.catch((error) => {
			response.send(error)
		})
})

router.delete("/:id", (request, response) => {
	deleteCustomer(request.params.id)
		.then((result) => {
			response.send({
				status: 200,
				message: "Customer deleted succesfully",
				customer: result,
			})
		})
		.catch((error) => {
			response.send(error)
		})
})

async function getCustomers() {
	try {
		const customers = await Customer.find().sort("id")
		if (customers.length) {
			return Promise.resolve(customers)
		} else {
			return Promise.reject(new Error("Couldn't find any customers'"))
		}
	} catch (error) {
		return Promise.reject(error)
	}
}

async function createCustomer(customer) {
	try {
		const newCustomer = new Customer({
			name: customer.name,
			isGold: customer.isGold,
			phone: customer.phone,
		})
		const result = await newCustomer.save()
		if (result) {
			return Promise.resolve(result)
		} else {
			return Promise.reject(new Error("Failed to create customer"))
		}
	} catch (error) {
		return Promise.reject(error)
	}
}

async function updateCustomer(id, body) {
	try {
		const customer = Customer.findByIdAndUpdate(
			id,
			{
				$set: {
					name: body.name,
					isGold: body.isGold,
					phone: body.phone,
				},
			},
			{
				new: true,
			}
		)
		if (customer) {
			return Promise.resolve(customer)
		} else {
			return Promise.reject(new Error("Failed to update customer"))
		}
	} catch (error) {
		return Promise.reject(error)
	}
}
async function deleteCustomer(id) {
	try {
		const customer = await Customer.findByIdAndDelete(id)
		if (customer) {
			return Promise.resolve(customer)
		} else {
			return Promise.reject(new Error("Customer couldn't be deleted"))
		}
	} catch (error) {
		return Promise.reject(error)
	}
}

module.exports = router
