const express = require("express");
const { protect } = require("../middleware/auth");
const { successResponse } = require("../utils/response");

const router = express.Router();

router.get("/profile", protect, (req, res) => {
	return successResponse(res, {
		statusCode: 200,
		message: "User profile fetched successfully.",
		data: req.user.toSafeObject(),
	});
});

module.exports = router;
