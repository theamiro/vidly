const express = require("express")
const router = express.Router()
const debug = require("debug")("app:startup")
const Movie = require("../models/Movie")
const Genre = require("../models/Genre")

router.use(express.json())

router.get("/", (request, response) => {
	getMovies()
		.then((movies) => {
			response.send({
				status: 200,
				message: "Fetched movies successfully",
				movies: movies,
			})
		})
		.catch((error) => {
			response.send(error)
		})
})
router.get("/:id", (request, response) => {
	getMovieByID(request.params.id)
		.then((movie) => {
			response.send({
				status: 200,
				message: "Fetched movies successfully",
				movie: movie,
			})
		})
		.catch((error) => {
			response.send(error)
		})
})

router.post("/", (request, response) => {
	createMovie(request.body)
		.then((movie) => {
			response.send({
				status: 200,
				message: "Created genre successfully",
				movie: movie,
			})
		})
		.catch((error) => {
			response.send(error)
		})
})
router.patch("/:id", (request, response) => {
	updateMovie(request.params.id, request.body)
		.then((movie) => {
			response.send({
				status: 200,
				message: "Updated genre successfully",
				movie: movie,
			})
		})
		.catch((error) => {
			response.send(error)
		})
})

router.delete("/:id", (request, response) => {
	deleteMovie(request.params.id)
		.then((movie) => {
			response.send({
				status: 200,
				message: "Deleted genre successfully",
				movie: movie,
			})
		})
		.catch((error) => {
			response.send(error)
		})
})

async function getMovies() {
	try {
		const movies = await Movie.find()
		if (movies.length) {
			return Promise.resolve(movies)
		} else {
			return Promise.reject(new Error("No genres found"))
		}
	} catch (error) {
		return Promise.reject(error)
	}
}
async function getMovieByID(id) {
	try {
		const movie = await Movie.findById(id)
		if (movie) {
			return Promise.resolve(movie)
		} else {
			return Promise.reject(`Couldn't find the genre with the ID ${id}`)
		}
	} catch (error) {
		return Promise.reject(error)
	}
}
async function createMovie(body) {
	try {
		const genre = await Genre.findById(body.genreID)
		if (!genre) {
			return Promise.reject(new Error("Genre does not exist"))
		}
		const movie = Movie({
			title: body.title,
			year: body.year,
			genre: {
				id: genre.id,
				name: genre.name,
			},
			numberInStock: body.numberInStock,
			dailyRentalRate: body.dailyRentalRate,
		})
		const result = await movie.save()
		if (result) {
			return Promise.resolve(result)
		} else {
			return Promise.reject(new Error("Failed to create Genre"))
		}
	} catch (error) {
		return Promise.reject(error)
	}
}
async function updateMovie(id, body) {
	try {
		const movie = await Movie.findByIdAndUpdate(
			id,
			{
				$set: body,
			},
			{
				new: true,
			}
		)
		if (movie) {
			return Promise.resolve(movie)
		} else {
			return Promise.reject(new Error("Failed to update Genre"))
		}
	} catch (error) {
		return Promise.reject(error)
	}
}
async function deleteMovie(id) {
	try {
		const movie = await Movie.findByIdAndDelete(id)
		if (movie) {
			return Promise.resolve(movie)
		} else {
			return Promise.reject(new Error("Failed to delete Genre"))
		}
	} catch (error) {
		return Promise.reject(error)
	}
}

module.exports = router
