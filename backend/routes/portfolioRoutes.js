const express = require("express");
const router  = express.Router();

const { protect, restrictTo } = require("../middleware/auth");
const achievementRoutes = require("./portfolio/achievementRoutes");
const certificationRoutes = require("./portfolio/certificationRoutes");
const experienceRoutes = require("./portfolio/experienceRoutes");
const projectRoutes = require("./portfolio/projectRoutes");
const publicationRoutes = require("./portfolio/publicationRoutes");
const skillRoutes = require("./portfolio/skillRoutes");
const {
  userController,
  userProfileController,
} = require("../controllers/portfolioController");

router.use(achievementRoutes);
router.use(certificationRoutes);
router.use(experienceRoutes);
router.use(projectRoutes);
router.use(publicationRoutes);
router.use(skillRoutes);

// User/profile endpoints stay centralized here because they already belong to the shared account area.
router.get("/users/me", protect, userController.getMe);
router.put("/users/me", protect, userController.updateMe);
router.put("/users/me/password", protect, userController.changePassword);
router.delete("/users/me", protect, userController.deleteMe);

router.get("/users", protect, restrictTo("admin"), userController.getAll);
router.delete("/users/:id", protect, restrictTo("admin"), userController.deleteUser);

router.get("/profile/me", protect, userProfileController.getMyProfile);
router.post("/profile", protect, userProfileController.create);
router.put("/profile", protect, userProfileController.update);
router.delete("/profile", protect, userProfileController.remove);
router.get("/profile/:username", userProfileController.getByUsername);

module.exports = router;