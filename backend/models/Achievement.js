const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Achievement title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: null,
    },
    issuingOrganization: {
      type: String,
      trim: true,
      maxlength: [100, "Organization name cannot exceed 100 characters"],
      default: null,
    },
    date: {
      type: Date,
      required: [true, "Achievement date is required"],
    },
    type: {
      type: String,
      enum: ["award", "scholarship", "competition", "recognition", "fellowship", "other"],
      default: "award",
    },
    url: {
      type: String, // Link to proof/certificate
      default: null,
    },
    image: {
      type: String, // URL to award image/certificate
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Achievement", achievementSchema);