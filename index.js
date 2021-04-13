require("dotenv").config()
const mongoose = require("mongoose")
const express = require("express")
const morgan = require("morgan")
const debug = require("debug")("app:startup")
const helmet = require("helmet")

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("./public"))
app.use(helmet())

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

const customers = require("./routes/customers")
app.use("/api/customers", customers)

const genres = require("./routes/genres")
app.use("/api/genres", genres)

const movies = require("./routes/movies")
app.use("/api/movies", movies)

const rentals = require("./routes/rentals")
app.use("/api/rentals", rentals)

if (process.env.ENV === "development") {
	app.use(morgan("tiny"))
	debug("Running in developement")
}

const port = process.env.PORT || 9000
app.listen(port, () => debug("Listening on port " + port))
