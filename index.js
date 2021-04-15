require("express-async-errors")
require("dotenv").config()
const winston = require("winston")
const mongoose = require("mongoose")
const express = require("express")
const morgan = require("morgan")
const debug = require("debug")("app:startup")
const helmet = require("helmet")
const error = require("./middleware/error")
// Routes
const customers = require("./routes/customers")
const genres = require("./routes/genres")
const movies = require("./routes/movies")
const rentals = require("./routes/rentals")
const users = require("./routes/auth/users")
const auth = require("./routes/auth/auth")

const app = express()

winston.add(new winston.transports.File({filename: "logger.log"}))

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

app.use("/api/customers", customers)
app.use("/api/genres", genres)
app.use("/api/movies", movies)
app.use("/api/rentals", rentals)
app.use("/api/users", users)
app.use("/api/auth", auth)

app.use(error)

if (process.env.ENV === "development") {
	app.use(morgan("tiny"))
	debug("Running in developement")
}

const port = process.env.PORT || 9000
app.listen(port, () => debug("Listening on port " + port))
