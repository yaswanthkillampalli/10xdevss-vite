const express = require("express");

const { protect } = require("../../middleware/auth");
const experienceController = require("../../controllers/portfolio/experienceController");

const router = express.Router();

router.get("/experience", protect, experienceController.getAll);
router.post("/experience", protect, experienceController.create);
router.get("/experience/:id", protect, experienceController.getOne);
router.put("/experience/:id", protect, experienceController.update);
router.delete("/experience/:id", protect, experienceController.remove);

module.exports = router;