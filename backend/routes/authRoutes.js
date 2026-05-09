const express = require("express");

const {
	register,
	login,
	refreshToken,
	logout,
	getMe,
	changePassword,
	forgotPassword,
	resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const {
	validateRegister,
	validateLogin,
	validateRefreshToken,
	validateForgotPassword,
	validateResetPassword,
} = require("../middleware/validate");

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/refresh-token", validateRefreshToken, refreshToken);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/reset-password", validateResetPassword, resetPassword);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.post("/change-password", protect, changePassword);

module.exports = router;
