const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
      maxlength: [50, "Skill name cannot exceed 50 characters"],
    },
    category: {
      type: String,
      enum: [
        "frontend",
        "backend",
        "database",
        "devops",
        "mobile",
        "ai-ml",
        "cybersecurity",
        "tools",
        "language",
        "other",
      ],
      required: [true, "Skill category is required"],
    },
    proficiency: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      default: "intermediate",
    },
    icon: {
      type: String,
      default: null,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    teamMembers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

// Prevent duplicate skills per user
skillSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Skill", skillSchema);