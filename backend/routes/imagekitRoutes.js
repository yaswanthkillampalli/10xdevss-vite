const express = require("express");

const { protect } = require("../middleware/auth");
const { getAuthParams } = require("../controllers/imagekitController");

const router = express.Router();

router.get("/auth", protect, getAuthParams);

module.exports = router;