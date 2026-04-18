const mongoose = require("mongoose");
const {
  isValidHttpUrl,
  normalizeOptionalString,
  normalizeStringArray,
  parseFlexibleDate,
} = require("./modelHelpers");

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    techStack: {
      type: [String], // e.g. ["React", "Node.js", "MongoDB"]
      default: [],
      set: normalizeStringArray,
    },
    githubUrl: {
      type: String,
      default: null,
      set: normalizeOptionalString,
      validate: {
        validator: isValidHttpUrl,
        message: "GitHub URL must be a valid http/https URL",
      },
    },
    liveUrl: {
      type: String,
      default: null,
      set: normalizeOptionalString,
      validate: {
        validator: isValidHttpUrl,
        message: "Live URL must be a valid http/https URL",
      },
    },
    thumbnail: {
      type: String, // URL
      default: null,
      set: normalizeOptionalString,
      validate: {
        validator: isValidHttpUrl,
        message: "Thumbnail URL must be a valid http/https URL",
      },
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      set: parseFlexibleDate,
    },
    endDate: {
      type: Date,
      default: null, // null = ongoing
      set: parseFlexibleDate,
    },
    status: {
      type: String,
      enum: ["ongoing", "completed", "on-hold"],
      default: "completed",
    },
    isFeatured: {
      type: Boolean,
      default: false, // Pin to top of portfolio
    },
  },
  { timestamps: true }
);

projectSchema.pre("validate", function (next) {
  if (this.status === "ongoing") {
    this.endDate = null;
  }

  if (this.endDate && this.startDate && this.endDate < this.startDate) {
    return next(new Error("End date must be after start date"));
  }

  return next();
});

module.exports = mongoose.model("Project", projectSchema);