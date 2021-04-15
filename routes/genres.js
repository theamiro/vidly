const express = require("express")
const router = express.Router()
const debug = require("debug")("app:startup")
const Genre = require("../models/Genre")

router.use(express.json())

router.get("/", async (request, response) => {
	const genres = await Genre.find()
	if (genres.length) {
		response.status(200).send({
			status: 200,
			message: "Genres found",
			genres: genres,
		})
	} else {
		response.status(404).send({
			status: 404,
			message: "Genres not found",
		})
	}
})

router.get("/:id", async (request, response) => {
	const genre = await Genre.findById(request.params.id)
	if (genre) {
		response.status(200).send({
			status: 200,
			message: "Genre found",
			genre: genre,
		})
	} else {
		response.status(404).send({
			status: 200,
			message: "Genre not found",
		})
	}
})

router.post("/", async (request, response) => {
	var genre = await Genre.findOne({name: request.body.name})
	if (genre) {
		return response.status(400).send({
			status: 400,
			message: "Genre already exists",
		})
	}
	genre = Genre({
		name: request.body.name,
		description: request.body.description,
	})
	const result = await genre.save()
	if (result) {
		response.status(200).send({
			status: 200,
			message: "Created genre successfully",
			genre: result,
		})
	} else {
		response.status(400).send({
			status: 400,
			message: "Failed to create Genre",
		})
	}
})

router.patch("/:id", async (request, response) => {
	const genre = await Genre.findByIdAndUpdate(
		request.params.id,
		{
			$set: request.body,
		},
		{
			new: true,
		}
	)
	if (genre) {
		response.status(200).send({
			status: 200,
			message: "Updated genre successfully",
			genre: genre,
		})
	} else {
		response.status(400).send({
			status: 400,
			message: "Failed to update genre",
		})
	}
})

router.delete("/:id", async (request, response) => {
	const genre = await Genre.findByIdAndDelete(request.params.id)
	if (genre) {
		response.status(200).send({
			status: 200,
			message: "Deleted genre successfully",
			genre: genre,
		})
	} else {
		response.status(400).send({
			status: 400,
			message: "Failed to delete genre",
		})
	}
})

module.exports = router
