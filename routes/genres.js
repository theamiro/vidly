const express = require("express")
const router = express.Router()
const debug = require("debug")("app:startup")
const Genre = require("../models/Genre")

router.use(express.json())

router.get("/", (request, response) => {
	getGenres()
		.then((genres) => {
			response.send({
				status: 200,
				message: "Fetched genres successfully",
				genres: genres,
			})
		})
		.catch((error) => {
			response.send(error)
		})
})
router.get("/:id", (request, response) => {
	getGenreByID(request.params.id)
		.then((genres) => {
			response.send({
				status: 200,
				message: "Fetched genres successfully",
				genre: genres,
			})
		})
		.catch((error) => {
			response.send(error)
		})
})

router.post("/", (request, response) => {
	createGenre(request.body)
		.then((genres) => {
			response.send({
				status: 200,
				message: "Created genre successfully",
				genres: genres,
			})
		})
		.catch((error) => {
			response.send(error)
		})
})
router.patch("/:id", (request, response) => {
	updateGenre(request.params.id, request.body)
		.then((genres) => {
			response.send({
				status: 200,
				message: "Updated genre successfully",
				genres: genres,
			})
		})
		.catch((error) => {
			response.send(error)
		})
})

router.delete("/:id", (request, response) => {
	deleteGenre(request.params.id)
		.then((genre) => {
			response.send({
				status: 200,
				message: "Deleted genre successfully",
				genre: genre,
			})
		})
		.catch((error) => {
			response.send(error)
		})
})

async function getGenres() {
	try {
		const genres = await Genre.find()
		if (genres.length) {
			return Promise.resolve(genres)
		} else {
			return Promise.reject(new Error("No genres found"))
		}
	} catch (error) {
		return Promise.reject(error)
	}
}
async function getGenreByID(id) {
	try {
		const genre = await Genre.findById(id)
		if (genre) {
			return Promise.resolve(genre)
		} else {
			return Promise.reject(`Couldn't find the genre with the ID ${id}`)
		}
	} catch (error) {
		return Promise.reject(error)
	}
}
async function createGenre(body) {
	try {
		const newGenre = Genre({
			name: body.name,
			description: body.description,
		})
		const result = await newGenre.save()
		if (result) {
			return Promise.resolve(result)
		} else {
			return Promise.reject(new Error("Failed to create Genre"))
		}
	} catch (error) {
		return Promise.reject(error)
	}
}
async function updateGenre(id, body) {
	try {
		const genre = await Genre.findByIdAndUpdate(
			id,
			{
				$set: body,
			},
			{
				new: true,
			}
		)
		if (genre) {
			return Promise.resolve(genre)
		} else {
			return Promise.reject(new Error("Failed to update Genre"))
		}
	} catch (error) {
		return Promise.reject(error)
	}
}
async function deleteGenre(id) {
	try {
		const genre = await Genre.findByIdAndDelete(id)
		if (genre) {
			return Promise.resolve(genre)
		} else {
			return Promise.reject(new Error("Failed to delete Genre"))
		}
	} catch (error) {
		return Promise.reject(error)
	}
}

module.exports = router
