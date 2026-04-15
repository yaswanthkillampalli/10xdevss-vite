const User          = require("../models/User");
const UserProfile   = require("../models/UserProfile");
const { successResponse, errorResponse } = require("../utils/response");

const achievementController = require("./portfolio/achievementController");
const certificationController = require("./portfolio/certificationController");
const experienceController = require("./portfolio/experienceController");
const projectController = require("./portfolio/projectController");
const publicationController = require("./portfolio/publicationController");
const skillController = require("./portfolio/skillController");

// ─── User controller ──────────────────────────────────────────────────────────
// Handles the core User document (name, email, role, password change etc.)

const userController = {

  // GET /api/users/me
  getMe: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      return successResponse(res, { message: "User fetched.", data: user.toSafeObject() });
    } catch (error) {
      return errorResponse(res, { statusCode: 500, message: "Could not fetch user." });
    }
  },

  // PUT /api/users/me  — update full name, email, roll and phone
  updateMe: async (req, res) => {
    try {
      const { fullName, emailId, rollId, phone } = req.body;
      const updateData = {};

      if (fullName !== undefined) updateData.fullName = fullName;
      if (emailId !== undefined) updateData.emailId = emailId;
      if (rollId !== undefined) updateData.rollId = rollId;
      if (phone !== undefined) updateData.phone = phone;

      const user = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true, runValidators: true }
      );
      return successResponse(res, { message: "User updated.", data: user.toSafeObject() });
    } catch (error) {
      if (error.code === 11000) {
        return errorResponse(res, { statusCode: 409, message: "Email already in use." });
      }
      return errorResponse(res, { statusCode: 500, message: "Could not update user." });
    }
  },

  // PUT /api/users/me/password  — change password
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return errorResponse(res, { statusCode: 400, message: "Both currentPassword and newPassword are required." });
      }
      if (newPassword.length < 6) {
        return errorResponse(res, { statusCode: 422, message: "New password must be at least 6 characters." });
      }

      const user = await User.findById(req.user._id).select("+password");
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return errorResponse(res, { statusCode: 401, message: "Current password is incorrect." });
      }

      user.password = newPassword;
      await user.save();
      return successResponse(res, { message: "Password changed successfully." });
    } catch (error) {
      return errorResponse(res, { statusCode: 500, message: "Could not change password." });
    }
  },

  // DELETE /api/users/me  — deactivate account
  deleteMe: async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.user._id, { isActive: false });
      return successResponse(res, { message: "Account deactivated successfully." });
    } catch (error) {
      return errorResponse(res, { statusCode: 500, message: "Could not deactivate account." });
    }
  },

  // ── Admin only ──

  // GET /api/users  — list all users
  getAll: async (req, res) => {
    try {
      const users = await User.find().sort({ createdAt: -1 });
      return successResponse(res, {
        message: "Users fetched.",
        data: users.map((u) => u.toSafeObject()),
      });
    } catch (error) {
      return errorResponse(res, { statusCode: 500, message: "Could not fetch users." });
    }
  },

  // DELETE /api/users/:id  — hard delete a user (admin)
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return errorResponse(res, { statusCode: 404, message: "User not found." });
      return successResponse(res, { message: "User deleted." });
    } catch (error) {
      return errorResponse(res, { statusCode: 500, message: "Could not delete user." });
    }
  },
};

// ─── UserProfile controller ───────────────────────────────────────────────────
// 1-to-1 with User. GET or upsert (create-or-update) the profile.

const userProfileController = {

  // GET /api/profile/me  — get own profile
  getMyProfile: async (req, res) => {
    try {
      const profile = await UserProfile.findOne({ userId: req.user._id });
      if (!profile) {
        return errorResponse(res, { statusCode: 404, message: "Profile not found. Please create one." });
      }
      return successResponse(res, { message: "Profile fetched.", data: profile });
    } catch (error) {
      return errorResponse(res, { statusCode: 500, message: "Could not fetch profile." });
    }
  },

  // GET /api/profile/:username  — public view of someone's profile
  getByUsername: async (req, res) => {
    try {
      const profile = await UserProfile.findOne({
        username: req.params.username.toLowerCase(),
        isPublic: true,
      }).populate("userId", "fullName emailId role");

      if (!profile) {
        return errorResponse(res, { statusCode: 404, message: "Profile not found." });
      }
      return successResponse(res, { message: "Profile fetched.", data: profile });
    } catch (error) {
      return errorResponse(res, { statusCode: 500, message: "Could not fetch profile." });
    }
  },

  // POST /api/profile  — create profile (only once)
  create: async (req, res) => {
    try {
      const exists = await UserProfile.findOne({ userId: req.user._id });
      if (exists) {
        return errorResponse(res, { statusCode: 409, message: "Profile already exists. Use PUT to update." });
      }
      const profile = await UserProfile.create({ ...req.body, userId: req.user._id });
      return successResponse(res, { statusCode: 201, message: "Profile created.", data: profile });
    } catch (error) {
      if (error.code === 11000) {
        return errorResponse(res, { statusCode: 409, message: "Username already taken." });
      }
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((e) => ({ field: e.path, message: e.message }));
        return errorResponse(res, { statusCode: 422, message: "Validation failed.", errors });
      }
      return errorResponse(res, { statusCode: 500, message: "Could not create profile." });
    }
  },

  // PUT /api/profile  — update own profile
  update: async (req, res) => {
    try {
      const { userId, ...updateData } = req.body;
      const profile = await UserProfile.findOneAndUpdate(
        { userId: req.user._id },
        updateData,
        { new: true, runValidators: true }
      );
      if (!profile) {
        return errorResponse(res, { statusCode: 404, message: "Profile not found. Please create one first." });
      }
      return successResponse(res, { message: "Profile updated.", data: profile });
    } catch (error) {
      if (error.code === 11000) {
        return errorResponse(res, { statusCode: 409, message: "Username already taken." });
      }
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((e) => ({ field: e.path, message: e.message }));
        return errorResponse(res, { statusCode: 422, message: "Validation failed.", errors });
      }
      return errorResponse(res, { statusCode: 500, message: "Could not update profile." });
    }
  },

  // DELETE /api/profile  — delete own profile
  remove: async (req, res) => {
    try {
      const profile = await UserProfile.findOneAndDelete({ userId: req.user._id });
      if (!profile) {
        return errorResponse(res, { statusCode: 404, message: "Profile not found." });
      }
      return successResponse(res, { message: "Profile deleted." });
    } catch (error) {
      return errorResponse(res, { statusCode: 500, message: "Could not delete profile." });
    }
  },
};

module.exports = {
  achievementController,
  certificationController,
  experienceController,
  projectController,
  publicationController,
  skillController,
  userController,
  userProfileController,
};