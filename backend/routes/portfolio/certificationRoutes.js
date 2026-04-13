const express = require("express");

const { protect } = require("../../middleware/auth");
const certificationController = require("../../controllers/portfolio/certificationController");

const router = express.Router();

router.get("/certifications", protect, certificationController.getAll);
router.post("/certifications", protect, certificationController.create);
router.get("/certifications/:id", protect, certificationController.getOne);
router.put("/certifications/:id", protect, certificationController.update);
router.delete("/certifications/:id", protect, certificationController.remove);

module.exports = router;