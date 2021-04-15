module.exports = function asyncMiddleware(handler) {
	return async (request, response, next) => {
		try {
			await handler(request, response)
		} catch (exception) {
			next(exception)
		}
	}
}
