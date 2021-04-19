require("express-async-errors")
require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const debug = require("debug")("app:startup")
const helmet = require("helmet")
const app = express()

if (process.env.ENV === "development") {
	app.use(morgan("dev"))
	debug("Running in developement")
}
require("./app/logger")
require("./app/db")
require("./app/routes")(app)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("./public"))
app.use(helmet())

const port = process.env.PORT || 9000
app.listen(port, () => debug("Listening on port " + port))
