const auth = require("../middleware/auth")
const express = require("express")
const router = express.Router()
const debug = require("debug")("app:startup")

const Customer = require("../models/Customer")
const Movie = require("../models/Movie")
const Rental = require("../models/Rental")

router.use(express.json())

router.get("/", async (request, response) => {
	const rentals = await Rental.find()
	if (rentals.length) {
		response.status(200).send({
			status: 200,
			message: "Rentals fetched successfully",
			rentals: rentals,
		})
	} else {
		response.status(404).send({
			status: 404,
			message: "Rentals not found",
		})
	}
})
router.get("/:id", async (request, response) => {
	const rental = await Rental.findById(request.params.id)
	if (rental) {
		response.status(200).send({
			status: 200,
			message: "Rental with the ID found",
			rental,
			rental,
		})
	} else {
		response.status(404).send({
			status: 404,
			message: "Rental with the ID not found",
		})
	}
})

router.post("/", auth, async (request, response) => {
	const customer = await Customer.findById(request.body.customerID)
	if (!customer) {
		return response.status(404).send({
			status: 404,
			message: "Rental with the ID not found",
		})
	}
	debug(customer)
	const movie = await Movie.findById(request.body.movieID)
	if (!movie) {
		return response.status(404).send({
			status: 404,
			message: "Movie with the ID not found",
		})
	}
	debug(movie)
	if (movie.numberInStock === 0) {
		return response.status(400).send({
			status: 404,
			message: "Movie selected is out of stock",
		})
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
	// Transactions in Mongo
	const result = await rental.save()

	if (result) {
		movie.numberInStock--
		movie.save()
		response.status(200).send({
			status: 200,
			message: "Rental created",
			rental: result,
		})
	} else {
		response.status(400).send({
			status: 400,
			message: "Rental creation failed",
		})
	}
})
router.patch("/:id", auth, async (request, response) => {
	const rental = await Rental.findByIdAndUpdate(
		request.params.id,
		{
			$set: request.body,
		},
		{
			new: true,
		}
	)
	if (rental) {
		response.status(200).send({
			status: 200,
			message: "Rental updated",
			rental: rental,
		})
	} else {
		response.status(200).send({
			status: 200,
			message: "Failed to update rental",
		})
	}
})

router.delete("/:id", auth, async (request, response) => {
	const rental = await Rental.findByIdAndDelete(id)
	if (rental) {
		response.status(200).send({
			status: 200,
			message: "Rental deleted successfully",
			rental: rental,
		})
	} else {
		response.status(400).send({
			status: 400,
			message: "Failed to delete rental",
		})
	}
})

module.exports = router
