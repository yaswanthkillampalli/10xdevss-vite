const successResponse = (
	res,
	{ statusCode = 200, message = "Success", data = null, token, refreshToken } = {}
) => {
	const payload = { success: true, message };

	if (data !== null) payload.data = data;
	if (token) payload.token = token;
	if (refreshToken) payload.refreshToken = refreshToken;

	return res.status(statusCode).json(payload);
};

const errorResponse = (res, { statusCode = 500, message = "Something went wrong", errors } = {}) => {
	const payload = { success: false, message };

	if (errors) payload.errors = errors;

	return res.status(statusCode).json(payload);
};

module.exports = { successResponse, errorResponse };
