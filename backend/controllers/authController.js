const User = require("../models/User");
const UserProfile = require("../models/UserProfile");
const PasswordResetOtp = require("../models/PasswordResetOtp");
const crypto = require("crypto");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  buildTokenPayload,
  getAccessTokenExpiresAt,
  getRefreshTokenExpiresAt,
} = require("../utils/jwt");
const { sendPasswordResetOtpEmail } = require("../utils/email");
const { successResponse, errorResponse } = require("../utils/response");

const FORGOT_PASSWORD_GENERIC_MESSAGE =
  "If an account with that email exists, an OTP has been sent.";

const generateSixDigitOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const hashOtp = (otp) => crypto.createHash("sha256").update(String(otp)).digest("hex");

// Helper to build complete user response with profile
const buildUserWithProfile = async (user) => {
  const profile = await UserProfile.findOne({ userId: user._id });
  return {
    user: user.toSafeObject(),
    profile: profile ? {
      avatar: profile.avatar,
      headline: profile.headline,
      location: profile.location,
      bio: profile.bio,
      socialLinks: profile.socialLinks,
      isPublic: profile.isPublic,
    } : {
      avatar: null,
      headline: null,
      location: null,
      bio: null,
      socialLinks: { github: null, linkedin: null, twitter: null, portfolio: null },
      isPublic: true,
    },
  };
};

// ─── Register ────────────────────────────────────────────────────────────────

const register = async (req, res) => {
  try {
    const { fullName, emailId, rollId, phone, password, role } = req.body;

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
      role: role || "student",
    });

    // Issue tokens
    const payload = buildTokenPayload(user);
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Persist refresh token hash in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Build response with profile
    const userWithProfile = await buildUserWithProfile(user);

    return successResponse(res, {
      statusCode: 201,
      message: "Account created successfully.",
      data: userWithProfile,
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

    // Build response with profile
    const userWithProfile = await buildUserWithProfile(user);

    return successResponse(res, {
      statusCode: 200,
      message: "Logged in successfully.",
      data: userWithProfile,
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

// ─── Change Password (protected) ───────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body || {};

    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return errorResponse(res, { statusCode: 400, message: "currentPassword, newPassword and confirmPassword are required." });
    }

    if (String(newPassword).length < 6) {
      return errorResponse(res, { statusCode: 422, message: "New password must be at least 6 characters." });
    }

    if (newPassword !== confirmPassword) {
      return errorResponse(res, { statusCode: 400, message: "newPassword and confirmPassword do not match." });
    }

    // Fetch user with sensitive fields
    const user = await User.findById(req.user._id).select("+password +refreshToken");
    if (!user) {
      return errorResponse(res, { statusCode: 404, message: "User not found." });
    }

    // Verify current password
    const isCurrent = await user.comparePassword(currentPassword);
    if (!isCurrent) {
      return errorResponse(res, { statusCode: 401, message: "Current password is incorrect." });
    }

    // Reject if new password equals current password
    const isSameAsOld = await user.comparePassword(newPassword);
    if (isSameAsOld) {
      return errorResponse(res, { statusCode: 400, message: "New password must be different from the current password." });
    }

    // Set new password (pre-save hook will hash it) and rotate refresh token
    user.password = newPassword;

    // Issue new tokens
    const payload = buildTokenPayload(user);
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    // Return safe user + new tokens
    return successResponse(res, {
      statusCode: 200,
      message: "Password changed successfully.",
      data: user.toSafeObject(),
      token: accessToken,
      expiresAt: getAccessTokenExpiresAt(),
      refreshToken,
      refreshExpiresAt: getRefreshTokenExpiresAt(),
    });
  } catch (error) {
    console.error("Change password error:", error);
    return errorResponse(res, { statusCode: 500, message: "Could not change password." });
  }
};

// ─── Forgot Password (OTP) ───────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const emailId = String(req.body?.emailId || "").trim().toLowerCase();

    if (!emailId) {
      return errorResponse(res, { statusCode: 400, message: "emailId is required." });
    }

    const user = await User.findOne({ emailId });

    // Prevent user enumeration by returning the same message whether the user exists or not.
    if (!user) {
      return successResponse(res, {
        statusCode: 200,
        message: FORGOT_PASSWORD_GENERIC_MESSAGE,
      });
    }

    const otp = generateSixDigitOtp();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Upsert ensures only one active OTP record per email and invalidates any previous OTP.
    await PasswordResetOtp.findOneAndUpdate(
      { emailId },
      { otpHash, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    try {
      await sendPasswordResetOtpEmail({ toEmail: emailId, otp });
    } catch (emailError) {
      console.error("Forgot password email error:", emailError);
    }

    return successResponse(res, {
      statusCode: 200,
      message: FORGOT_PASSWORD_GENERIC_MESSAGE,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return errorResponse(res, { statusCode: 500, message: "Could not process forgot password request." });
  }
};

// ─── Reset Password (OTP) ────────────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const emailId = String(req.body?.emailId || "").trim().toLowerCase();
    const otp = String(req.body?.otp || "").trim();
    const newPassword = String(req.body?.newPassword || "");
    const confirmPassword = String(req.body?.confirmPassword || "");

    if (!emailId || !otp || !newPassword || !confirmPassword) {
      return errorResponse(res, {
        statusCode: 400,
        message: "emailId, otp, newPassword and confirmPassword are required.",
      });
    }

    if (newPassword !== confirmPassword) {
      return errorResponse(res, {
        statusCode: 400,
        message: "newPassword and confirmPassword do not match.",
      });
    }

    if (newPassword.length < 6) {
      return errorResponse(res, { statusCode: 422, message: "newPassword must be at least 6 characters." });
    }

    const otpRecord = await PasswordResetOtp.findOne({ emailId });
    if (!otpRecord) {
      return errorResponse(res, { statusCode: 400, message: "Invalid or expired OTP." });
    }

    if (otpRecord.expiresAt.getTime() < Date.now()) {
      await PasswordResetOtp.deleteOne({ _id: otpRecord._id });
      return errorResponse(res, { statusCode: 400, message: "Invalid or expired OTP." });
    }

    const incomingOtpHash = hashOtp(otp);
    if (incomingOtpHash !== otpRecord.otpHash) {
      return errorResponse(res, { statusCode: 400, message: "Invalid or expired OTP." });
    }

    const user = await User.findOne({ emailId }).select("+refreshToken");
    if (!user) {
      await PasswordResetOtp.deleteOne({ _id: otpRecord._id });
      return errorResponse(res, { statusCode: 400, message: "Invalid or expired OTP." });
    }

    // Set raw password; User model pre-save hook hashes it.
    user.password = newPassword;

    // Invalidate old refresh token before issuing a new one.
    user.refreshToken = null;

    const payload = buildTokenPayload(user);
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    // OTP is one-time use.
    await PasswordResetOtp.deleteOne({ _id: otpRecord._id });

    return successResponse(res, {
      statusCode: 200,
      message: "Password reset successful.",
      data: user.toSafeObject(),
      token: accessToken,
      expiresAt: getAccessTokenExpiresAt(),
      refreshToken,
      refreshExpiresAt: getRefreshTokenExpiresAt(),
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return errorResponse(res, { statusCode: 500, message: "Could not reset password." });
  }
};

module.exports = { register, login, refreshToken, logout, getMe, changePassword, forgotPassword, resetPassword };