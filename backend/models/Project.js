const mongoose = require("mongoose");

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
    },
    githubUrl: {
      type: String,
      default: null,
    },
    liveUrl: {
      type: String,
      default: null,
    },
    thumbnail: {
      type: String, // URL
      default: null,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      default: null, // null = ongoing
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

module.exports = mongoose.model("Project", projectSchema);