const User = require("../models/User");
const { successResponse, errorResponse } = require("../utils/response");

// ─── Get All Users (with pagination) ─────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    // Build search query
    const searchRegex = new RegExp(search.trim(), "i");
    const query = search.trim()
      ? {
          $or: [
            { fullName: searchRegex },
            { emailId: searchRegex },
            { rollId: searchRegex },
            { phone: searchRegex },
          ],
        }
      : {};

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Fetch users
    const users = await User.find(query)
      .select("-password -refreshToken")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    return successResponse(res, {
      statusCode: 200,
      message: "Users fetched successfully.",
      data: {
        users,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return errorResponse(res, { statusCode: 500, message: "Could not fetch users." });
  }
};

// ─── Get User By ID ──────────────────────────────────────────────────────────
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password -refreshToken");
    if (!user) {
      return errorResponse(res, { statusCode: 404, message: "User not found." });
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User fetched successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    return errorResponse(res, { statusCode: 500, message: "Could not fetch user." });
  }
};

// ─── Update User Profile (by Admin) ──────────────────────────────────────────
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, rollId, phone, role, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, { statusCode: 404, message: "User not found." });
    }

    // Update allowed fields
    if (fullName !== undefined && fullName.trim()) {
      user.fullName = fullName.trim();
    }
    if (rollId !== undefined && rollId.trim()) {
      // Check if rollId is unique (excluding current user)
      const existingRollId = await User.findOne({
        rollId: rollId.trim(),
        _id: { $ne: id },
      });
      if (existingRollId) {
        return errorResponse(res, { statusCode: 409, message: "Roll ID already in use." });
      }
      user.rollId = rollId.trim();
    }
    if (phone !== undefined && phone.trim()) {
      user.phone = phone.trim();
    }
    if (role !== undefined && ["student", "admin", "faculty"].includes(role)) {
      user.role = role;
    }
    if (isActive !== undefined && typeof isActive === "boolean") {
      user.isActive = isActive;
    }

    await user.save();

    return successResponse(res, {
      statusCode: 200,
      message: "User profile updated successfully.",
      data: user.toSafeObject(),
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    return errorResponse(res, { statusCode: 500, message: "Could not update user profile." });
  }
};

// ─── Change User Password (by Admin) ─────────────────────────────────────────
const changeUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return errorResponse(res, {
        statusCode: 400,
        message: "newPassword and confirmPassword are required.",
      });
    }

    if (newPassword.length < 6) {
      return errorResponse(res, {
        statusCode: 422,
        message: "Password must be at least 6 characters.",
      });
    }

    if (newPassword !== confirmPassword) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Passwords do not match.",
      });
    }

    const user = await User.findById(id).select("+password +refreshToken");
    if (!user) {
      return errorResponse(res, { statusCode: 404, message: "User not found." });
    }

    // Check if new password is same as old
    const isSameAsOld = await user.comparePassword(newPassword);
    if (isSameAsOld) {
      return errorResponse(res, {
        statusCode: 400,
        message: "New password must be different from the current password.",
      });
    }

    // Set new password (pre-save hook will hash it)
    user.password = newPassword;
    user.refreshToken = null; // Invalidate old sessions
    await user.save();

    return successResponse(res, {
      statusCode: 200,
      message: "User password changed successfully.",
      data: user.toSafeObject(),
    });
  } catch (error) {
    console.error("Change user password error:", error);
    return errorResponse(res, { statusCode: 500, message: "Could not change user password." });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserProfile,
  changeUserPassword,
};
