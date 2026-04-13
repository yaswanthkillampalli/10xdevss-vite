const errorHandler = (err, req, res, next) => {
	console.error("Unhandled error:", err);

	if (res.headersSent) {
		return next(err);
	}

	return res.status(err.statusCode || 500).json({
		success: false,
		message: err.message || "Internal server error",
	});
};

module.exports = errorHandler;
