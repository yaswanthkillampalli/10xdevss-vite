const express = require("express");
const { protect, restrictTo } = require("../middleware/auth");
const {
  getAllUsers,
  getUserById,
  updateUserProfile,
  changeUserPassword,
} = require("../controllers/adminController");

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, restrictTo("admin"));

// Get all users with pagination and search
router.get("/users", getAllUsers);

// Get single user by ID
router.get("/users/:id", getUserById);

// Update user profile
router.put("/users/:id", updateUserProfile);

// Change user password
router.post("/users/:id/change-password", changeUserPassword);

module.exports = router;
