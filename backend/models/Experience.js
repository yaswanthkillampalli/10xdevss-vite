const mongoose = require("mongoose");
const {
  isValidHttpUrl,
  normalizeOptionalString,
  normalizeStringArray,
  parseFlexibleDate,
} = require("./modelHelpers");

const experienceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    role: {
      type: String,
      required: [true, "Role/position is required"],
      trim: true,
      maxlength: [100, "Role cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      default: null,
    },
    type: {
      type: String,
      enum: ["internship", "full-time", "part-time", "contract", "freelance", "volunteer"],
      default: "internship",
    },
    location: {
      type: String,
      maxlength: [100, "Location cannot exceed 100 characters"],
      default: null,
    },
    locationType: {
      type: String,
      enum: ["onsite", "remote", "hybrid"],
      default: "onsite",
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      set: parseFlexibleDate,
    },
    endDate: {
      type: Date,
      default: null,
      set: parseFlexibleDate,
    },
    isCurrent: {
      type: Boolean,
      default: false, // true = currently working here
    },
    skills: {
      type: [String], // Skills used in this role
      default: [],
      set: normalizeStringArray,
    },
    companyLogo: {
      type: String, // URL
      default: null,
      set: normalizeOptionalString,
      validate: {
        validator: isValidHttpUrl,
        message: "Company logo URL must be a valid http/https URL",
      },
    },
  },
  { timestamps: true }
);

// Validate end date
experienceSchema.pre("save", function (next) {
  if (!this.isCurrent && this.endDate && this.endDate <= this.startDate) {
    return next(new Error("End date must be after start date"));
  }
  if (this.isCurrent) {
    this.endDate = null; // Clear end date if currently working
  }
  next();
});

module.exports = mongoose.model("Experience", experienceSchema);