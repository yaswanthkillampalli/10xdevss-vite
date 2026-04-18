const express = require("express");

const { protect } = require("../../middleware/auth");
const achievementController = require("../../controllers/portfolio/achievementController");

const router = express.Router();

router.get("/achievements/discover", protect, achievementController.getDiscover);
router.get("/achievements", protect, achievementController.getAll);
router.post("/achievements", protect, achievementController.create);
router.get("/achievements/:id", protect, achievementController.getOne);
router.put("/achievements/:id", protect, achievementController.update);
router.delete("/achievements/:id", protect, achievementController.remove);

module.exports = router;