const { verifyAccessToken } = require("../utils/jwt");
const { errorResponse } = require("../utils/response");
const User = require("../models/User");

/**
 * Protect routes — requires a valid JWT access token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Support Bearer token in Authorization header
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return errorResponse(res, {
        statusCode: 401,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Fetch user and attach to request
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return errorResponse(res, {
        statusCode: 401,
        message: "User not found or account deactivated.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return errorResponse(res, { statusCode: 401, message: "Token expired." });
    }
    if (error.name === "JsonWebTokenError") {
      return errorResponse(res, { statusCode: 401, message: "Invalid token." });
    }
    return errorResponse(res, { statusCode: 500, message: "Authentication error." });
  }
};

/**
 * Restrict access by role
 * Usage: restrictTo("admin")
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, {
        statusCode: 403,
        message: "You do not have permission to perform this action.",
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };