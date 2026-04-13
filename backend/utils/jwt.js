const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "dev-access-secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || "dev-refresh-secret";

const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

const ms = require("ms");

const getAccessTokenExpiresAt = () => {
	const now = new Date();
	const expiresInMs = ms(ACCESS_EXPIRES_IN);
	return new Date(now.getTime() + expiresInMs);
};

const getRefreshTokenExpiresAt = () => {
	const now = new Date();
	const expiresInMs = ms(REFRESH_EXPIRES_IN);
	return new Date(now.getTime() + expiresInMs);
};

const buildTokenPayload = (user) => ({
	id: user._id,
	fullName: user.fullName,
	emailId: user.emailId,
	rollId: user.rollId,
	role: user.role,
});

const generateAccessToken = (payload) => jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });

const generateRefreshToken = (payload) => jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

const verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET);

const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);

module.exports = {
	buildTokenPayload,
	generateAccessToken,
	generateRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
	getAccessTokenExpiresAt,
	getRefreshTokenExpiresAt,
	ACCESS_EXPIRES_IN,
	REFRESH_EXPIRES_IN,
};
