const express = require("express");

const { register, login, refreshToken, logout, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const {
	validateRegister,
	validateLogin,
	validateRefreshToken,
} = require("../middleware/validate");

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/refresh-token", validateRefreshToken, refreshToken);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

module.exports = router;
