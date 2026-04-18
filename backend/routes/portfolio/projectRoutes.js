const express = require("express");

const { protect } = require("../../middleware/auth");
const projectController = require("../../controllers/portfolio/projectController");

const router = express.Router();

router.get("/projects/discover", protect, projectController.getDiscover);
router.get("/projects", protect, projectController.getAll);
router.post("/projects", protect, projectController.create);
router.get("/projects/:id", protect, projectController.getOne);
router.put("/projects/:id", protect, projectController.update);
router.delete("/projects/:id", protect, projectController.remove);

module.exports = router;