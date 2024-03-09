module.exports = (error, req, res, next) => {
	if (error.status <= 500 && error) {
		// return res.status(error.status).json(error);
		return res.send(({
			"data":4
		}))
	} else {
		return next(error);
	}
};
