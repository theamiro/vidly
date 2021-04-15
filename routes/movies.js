const auth = require("../middleware/auth")
const express = require("express")
const router = express.Router()
const debug = require("debug")("app:startup")
const Movie = require("../models/Movie")
const Genre = require("../models/Genre")

router.use(express.json())

router.get("/", async (request, response) => {
	const movies = await Movie.find()
	if (movies.length) {
		response.status(200).send({
			status: 200,
			message: "Fetched movies successfully",
			movies: movies,
		})
	} else {
		response.status(404).send({
			status: 404,
			message: "Fetched movies successfully",
			movies: movies,
		})
	}
})
router.get("/:id", async (request, response) => {
	const movie = await Movie.findById(id)
	if (movie) {
		response.status(200).send({
			status: 200,
			message: "Fetched movie successfully",
			movie: movie,
		})
	} else {
		response.status(404).send({
			status: 404,
			message: "Movie with the ID not found",
			movies: movies,
		})
	}
})

router.post("/", auth, async (request, response) => {
	const genre = await Genre.findById(request.body.genreID)
	if (!genre) {
		return response.status(404).send({
			status: 404,
			message: "Movie with the ID not found",
		})
	}
	const movie = Movie({
		title: request.body.title,
		year: request.body.year,
		genre: {
			id: genre.id,
			name: genre.name,
		},
		numberInStock: request.body.numberInStock,
		dailyRentalRate: request.body.dailyRentalRate,
	})
	const result = await movie.save()
	if (result) {
		response.status(201).send({
			status: 201,
			message: "Movie created successfully",
			movie: result,
		})
	} else {
		response.status(404).send({
			status: 404,
			message: "Failed to create movie",
		})
	}
})
router.patch("/:id", auth, async (request, response) => {
	const movie = await Movie.findByIdAndUpdate(
		request.params.id,
		{
			$set: request.body,
		},
		{
			new: true,
		}
	)
	if (movie) {
		response.status(200).send({
			status: 200,
			message: "Movie updated successfully",
			movie: result,
		})
	} else {
		response.status(404).send({
			status: 404,
			message: "Failed to update movie",
		})
	}
})

router.delete("/:id", auth, async (request, response) => {
	const movie = await Movie.findByIdAndDelete(id)
	if (movie) {
		response.status(200).send({
			status: 200,
			message: "Movie deleted successfully",
			movie: movie,
		})
	} else {
		response.status(404).send({
			status: 404,
			message: "Genre not found",
		})
	}
})

module.exports = router
