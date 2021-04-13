const express = require("express")
const router = express.Router()
const debug = require("debug")("app:startup")

const Customer = require("../models/Customer")
const Movie = require("../models/Movie")
const Rental = require("../models/Rental")

router.use(express.json())

router.get("/", (request, response) => {
	getRentals()
		.then((rentals) => {
			response.send({
				status: 200,
				message: "Fetched rentals successfully",
				rentals: rentals,
			})
		})
		.catch((error) => {
			response.send(error)
		})
})
router.get("/:id", (request, response) => {
	getRentalByID(request.params.id)
		.then((rental) => {
			response.send({
				status: 200,
				message: "Fetched rentals successfully",
				rental: rental,
			})
		})
		.catch((error) => {
			response.send(error)
		})
})

router.post("/", (request, response) => {
	createRental(request.body)
		.then((rental) => {
			response.send({
				status: 200,
				message: "Created rental successfully",
				rental: rental,
			})
		})
		.catch((error) => {
			response.send(error)
		})
})
router.patch("/:id", (request, response) => {
	updateRental(request.params.id, request.body)
		.then((rental) => {
			response.send({
				status: 200,
				message: "Updated rental successfully",
				rental: rental,
			})
		})
		.catch((error) => {
			response.send(error)
		})
})

router.delete("/:id", (request, response) => {
	deleteRental(request.params.id)
		.then((rental) => {
			response.send({
				status: 200,
				message: "Deleted rental successfully",
				rental: rental,
			})
		})
		.catch((error) => {
			response.send(error)
		})
})

async function getRentals() {
	try {
		const rentals = await Rental.find()
		if (rentals.length) {
			return Promise.resolve(rentals)
		} else {
			return Promise.reject(new Error("No rentals found"))
		}
	} catch (error) {
		return Promise.reject(error)
	}
}
async function getRentalByID(id) {
	try {
		const rental = await Rental.findById(id)
		if (rental) {
			return Promise.resolve(rental)
		} else {
			return Promise.reject(`Couldn't find the rental with the ID ${id}`)
		}
	} catch (error) {
		return Promise.reject(error)
	}
}
async function createRental(body) {
	try {
		const customer = await Customer.findById(body.customerID)
		if (!customer) {
			return Promise.reject(new Error("Customer does not exist"))
		}
		debug(customer)
		const movie = await Movie.findById(body.movieID)
		if (!movie) {
			return Promise.reject(new Error("Movie does not exist"))
		}
		debug(movie)
		if (movie.numberInStock === 0) {
			return Promise.reject(new Error("Movie is out of stock"))
		}

		const rental = Rental({
			customer: {
				_id: customer._id,
				name: customer.name,
				isGold: customer.isGold,
				phone: customer.phone,
			},
			movie: {
				id: movie._id,
				title: movie.title,
				dailyRentalRate: movie.dailyRentalRate,
			},
		})
		debug(rental)
		const result = await rental.save()

		movie.numberInStock--
		movie.save()

		if (result) {
			return Promise.resolve(result)
		} else {
			return Promise.reject(new Error("Failed to create Genre"))
		}
	} catch (error) {
		return Promise.reject(error)
	}
}
async function updateRental(id, body) {
	try {
		const rental = await Rental.findByIdAndUpdate(
			id,
			{
				$set: body,
			},
			{
				new: true,
			}
		)
		if (rental) {
			return Promise.resolve(rental)
		} else {
			return Promise.reject(new Error("Failed to update Rental"))
		}
	} catch (error) {
		return Promise.reject(error)
	}
}
async function deleteRental(id) {
	try {
		const rental = await Rental.findByIdAndDelete(id)
		if (rental) {
			return Promise.resolve(rental)
		} else {
			return Promise.reject(new Error("Failed to delete Rental"))
		}
	} catch (error) {
		return Promise.reject(error)
	}
}

module.exports = router
