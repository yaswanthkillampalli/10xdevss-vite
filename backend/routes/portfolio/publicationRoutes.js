const express = require("express");

const { protect } = require("../../middleware/auth");
const publicationController = require("../../controllers/portfolio/publicationController");

const router = express.Router();

router.get("/publications", protect, publicationController.getAll);
router.post("/publications", protect, publicationController.create);
router.get("/publications/:id", protect, publicationController.getOne);
router.put("/publications/:id", protect, publicationController.update);
router.delete("/publications/:id", protect, publicationController.remove);

module.exports = router;