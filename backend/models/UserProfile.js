const mongoose = require("mongoose");
const { isValidHttpUrl, normalizeOptionalString } = require("./modelHelpers");

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"],
    },
    avatar: {
      type: String, // URL to image
      default: null,
      set: normalizeOptionalString,
      validate: {
        validator: isValidHttpUrl,
        message: "Avatar URL must be a valid http/https URL",
      },
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default: null,
    },
    headline: {
      type: String, // e.g. "Full Stack Developer | Researcher"
      maxlength: [100, "Headline cannot exceed 100 characters"],
      default: null,
    },
    location: {
      type: String,
      maxlength: [100, "Location cannot exceed 100 characters"],
      default: null,
    },
    phone: {
      type: String,
      match: [/^\+?[\d\s\-().]{7,20}$/, "Please enter a valid phone number"],
      default: null,
    },
    socialLinks: {
      github: {
        type: String,
        default: null,
        set: normalizeOptionalString,
        validate: {
          validator: isValidHttpUrl,
          message: "GitHub URL must be a valid http/https URL",
        },
      },
      linkedin: {
        type: String,
        default: null,
        set: normalizeOptionalString,
        validate: {
          validator: isValidHttpUrl,
          message: "LinkedIn URL must be a valid http/https URL",
        },
      },
      twitter: {
        type: String,
        default: null,
        set: normalizeOptionalString,
        validate: {
          validator: isValidHttpUrl,
          message: "Twitter URL must be a valid http/https URL",
        },
      },
      portfolio: {
        type: String,
        default: null,
        set: normalizeOptionalString,
        validate: {
          validator: isValidHttpUrl,
          message: "Portfolio URL must be a valid http/https URL",
        },
      },
    },
    isPublic: {
      type: Boolean,
      default: true, // Portfolio visible to public
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);