const {createLogger, transports} = require("winston")
require("express-async-errors")

const logger = createLogger({
	exitOnError: false,
	transports: [
		new transports.Console(),
		new transports.File({filename: "logger.log"}),
	],
	exceptionHandlers: [new transports.File({filename: "exceptions.log"})],
	rejectionHandlers: [new transports.File({filename: "rejections.log"})],
})

logger.exceptions.handle(new transports.File({filename: "exceptions.log"}))
logger.rejections.handle(new transports.File({filename: "exceptions.log"}))

module.exports = logger
