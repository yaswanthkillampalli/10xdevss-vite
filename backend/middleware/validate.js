const { errorResponse } = require("../utils/response");

const REGISTRATION_ROLES = ["student", "faculty"];

const validateRegister = (req, res, next) => {
	const { fullName, emailId, rollId, phone, password, role } = req.body;

	if (!fullName || !emailId || !rollId || !phone || !password) {
		return errorResponse(res, {
			statusCode: 400,
			message: "fullName, emailId, rollId, phone and password are required.",
		});
	}

	if (typeof fullName !== "string" || fullName.trim().length < 2) {
		return errorResponse(res, { statusCode: 400, message: "fullName must be at least 2 characters." });
	}

	if (!/^\S+@\S+\.\S+$/.test(String(emailId).trim())) {
		return errorResponse(res, { statusCode: 400, message: "emailId must be a valid email address." });
	}

	if (typeof rollId !== "string" || rollId.trim().length < 2) {
		return errorResponse(res, { statusCode: 400, message: "rollId must be at least 2 characters." });
	}

	if (!/^\d{10}$/.test(String(phone).trim())) {
		return errorResponse(res, { statusCode: 400, message: "phone must be a valid 10 digit number." });
	}

	if (String(password).length < 6) {
		return errorResponse(res, { statusCode: 400, message: "password must be at least 6 characters." });
	}

	if (role && !REGISTRATION_ROLES.includes(role)) {
		return errorResponse(res, {
			statusCode: 400,
			message: `role must be one of: ${REGISTRATION_ROLES.join(", ")}.`,
		});
	}

	next();
};

const validateLogin = (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return errorResponse(res, { statusCode: 400, message: "email and password are required." });
	}

	if (!/^\S+@\S+\.\S+$/.test(String(email).trim())) {
		return errorResponse(res, { statusCode: 400, message: "email must be a valid email address." });
	}

	next();
};

const validateRefreshToken = (req, res, next) => {
	if (!req.body.refreshToken) {
		return errorResponse(res, { statusCode: 400, message: "refreshToken is required." });
	}
	next();
};

const validateForgotPassword = (req, res, next) => {
	const { emailId } = req.body || {};

	if (!emailId) {
		return errorResponse(res, { statusCode: 400, message: "emailId is required." });
	}

	if (!/^\S+@\S+\.\S+$/.test(String(emailId).trim())) {
		return errorResponse(res, { statusCode: 400, message: "emailId must be a valid email address." });
	}

	next();
};

const validateResetPassword = (req, res, next) => {
	const { emailId, otp, newPassword, confirmPassword } = req.body || {};

	if (!emailId || !otp || !newPassword || !confirmPassword) {
		return errorResponse(res, {
			statusCode: 400,
			message: "emailId, otp, newPassword and confirmPassword are required.",
		});
	}

	if (!/^\S+@\S+\.\S+$/.test(String(emailId).trim())) {
		return errorResponse(res, { statusCode: 400, message: "emailId must be a valid email address." });
	}

	if (!/^\d{6}$/.test(String(otp).trim())) {
		return errorResponse(res, { statusCode: 400, message: "otp must be a valid 6 digit code." });
	}

	if (String(newPassword).length < 6) {
		return errorResponse(res, { statusCode: 400, message: "newPassword must be at least 6 characters." });
	}

	if (String(newPassword) !== String(confirmPassword)) {
		return errorResponse(res, { statusCode: 400, message: "newPassword and confirmPassword do not match." });
	}

	next();
};

module.exports = {
	validateRegister,
	validateLogin,
	validateRefreshToken,
	validateForgotPassword,
	validateResetPassword,
};
