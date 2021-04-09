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

const customers = require("./routes/customers")
app.use("/api/customers", customers)

const genres = require("./routes/genres")
app.use("/api/genres", genres)

if (process.env.ENV === "development") {
	app.use(morgan("tiny"))
	debug("Running in developement")
}

const port = process.env.PORT || 9000
app.listen(port, () => console.log("Listening on port " + port))
