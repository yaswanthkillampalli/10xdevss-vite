const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  buildTokenPayload,
  getAccessTokenExpiresAt,
  getRefreshTokenExpiresAt,
} = require("../utils/jwt");
const { successResponse, errorResponse } = require("../utils/response");

// ─── Register ────────────────────────────────────────────────────────────────

const register = async (req, res) => {
  try {
    const { fullName, emailId, rollId, phone, password } = req.body;

    // Check if email or rollId is already taken
    const existingUser = await User.findOne({
      $or: [{ emailId: emailId.toLowerCase() }, { rollId }],
    });
    if (existingUser) {
      return errorResponse(res, {
        statusCode: 409,
        message: "An account with this email or roll ID already exists.",
      });
    }

    // Create user (password is hashed by the pre-save hook in the model)
    const user = await User.create({
      fullName,
      emailId: emailId.toLowerCase(),
      rollId,
      phone,
      password,
    });

    // Issue tokens
    const payload = buildTokenPayload(user);
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Persist refresh token hash in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return successResponse(res, {
      statusCode: 201,
      message: "Account created successfully.",
      data: user.toSafeObject(),
      token: accessToken,
      expiresAt: getAccessTokenExpiresAt(),
      refreshToken,
      refreshExpiresAt: getRefreshTokenExpiresAt(),
    });
  } catch (error) {
    console.error("Register error:", error);
    return errorResponse(res, { statusCode: 500, message: "Registration failed." });
  }
};

// ─── Login ───────────────────────────────────────────────────────────────────

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user with password field (excluded by default)
    const user = await User.findOne({ emailId: email.toLowerCase() }).select("+password +refreshToken");
    if (!user) {
      return errorResponse(res, { statusCode: 401, message: "Invalid email or password." });
    }

    if (!user.isActive) {
      return errorResponse(res, { statusCode: 403, message: "Your account has been deactivated." });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, { statusCode: 401, message: "Invalid email or password." });
    }

    // Issue new tokens
    const payload = buildTokenPayload(user);
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Update last login and refresh token
    user.lastLogin = new Date();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return successResponse(res, {
      statusCode: 200,
      message: "Logged in successfully.",
      data: user.toSafeObject(),
      token: accessToken,
      expiresAt: getAccessTokenExpiresAt(),
      refreshToken,
      refreshExpiresAt: getRefreshTokenExpiresAt(),
    });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse(res, { statusCode: 500, message: "Login failed." });
  }
};

// ─── Refresh Token ───────────────────────────────────────────────────────────

const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return errorResponse(res, { statusCode: 400, message: "Refresh token is required." });
    }

    // Verify the refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      return errorResponse(res, { statusCode: 401, message: "Invalid or expired refresh token." });
    }

    // Ensure it matches what we stored (rotation check)
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== token) {
      return errorResponse(res, { statusCode: 401, message: "Refresh token revoked." });
    }

    // Issue new token pair (rotation)
    const payload = buildTokenPayload(user);
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return successResponse(res, {
      statusCode: 200,
      message: "Tokens refreshed.",
      token: newAccessToken,
      expiresAt: getAccessTokenExpiresAt(),
      refreshToken: newRefreshToken,
      refreshExpiresAt: getRefreshTokenExpiresAt(),
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return errorResponse(res, { statusCode: 500, message: "Could not refresh token." });
  }
};

// ─── Logout ──────────────────────────────────────────────────────────────────

const logout = async (req, res) => {
  try {
    // Invalidate stored refresh token
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

    return successResponse(res, { statusCode: 200, message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    return errorResponse(res, { statusCode: 500, message: "Logout failed." });
  }
};

// ─── Get Current User ─────────────────────────────────────────────────────────

const getMe = async (req, res) => {
  return successResponse(res, {
    statusCode: 200,
    message: "User fetched successfully.",
    data: req.user.toSafeObject(),
  });
};

module.exports = { register, login, refreshToken, logout, getMe };