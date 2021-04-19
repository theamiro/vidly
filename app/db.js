const mongoose = require("mongoose")
const logger = require("../app/logger")
const debug = require("debug")("app:startup")

mongoose
	.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		logger.info("Successfully connected to Mongo")
		debug("Successfully connected to Mongo")
	})
