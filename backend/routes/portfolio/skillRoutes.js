const express = require("express");

const { protect } = require("../../middleware/auth");
const skillController = require("../../controllers/portfolio/skillController");

const router = express.Router();

router.get("/skills", protect, skillController.getAll);
router.post("/skills", protect, skillController.create);
router.get("/skills/:id", protect, skillController.getOne);
router.put("/skills/:id", protect, skillController.update);
router.delete("/skills/:id", protect, skillController.remove);

module.exports = router;