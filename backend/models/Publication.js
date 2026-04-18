const mongoose = require("mongoose");
const {
  isValidHttpUrl,
  normalizeOptionalString,
  normalizeStringArray,
  parseFlexibleDate,
} = require("./modelHelpers");

const publicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Publication title is required"],
      trim: true,
      maxlength: [250, "Title cannot exceed 250 characters"],
    },
    abstract: {
      type: String,
      maxlength: [3000, "Abstract cannot exceed 3000 characters"],
      default: null,
    },
    authors: {
      type: [String], // e.g. ["John Doe", "Jane Smith"]
      default: [],
    },
    venue: {
      // Journal name or Conference name
      type: String,
      trim: true,
      maxlength: [200, "Venue cannot exceed 200 characters"],
      default: null,
    },
    venueType: {
      type: String,
      enum: ["journal", "conference", "workshop", "preprint", "book-chapter", "other"],
      default: "journal",
    },
    publishedDate: {
      type: Date,
      default: null,
      set: parseFlexibleDate,
    },
    doi: {
      type: String,
      trim: true,
      default: null,
    },
    url: {
      type: String,
      trim: true,
      default: null,
      set: normalizeOptionalString,
      validate: {
        validator: isValidHttpUrl,
        message: "Publication URL must be a valid http/https URL",
      },
    },
    fileUrl: {
      type: String,
      trim: true,
      default: null,
      set: normalizeOptionalString,
      validate: {
        validator: isValidHttpUrl,
        message: "File URL must be a valid http/https URL",
      },
    },
    fileName: {
      type: String,
      trim: true,
      maxlength: [260, "File name cannot exceed 260 characters"],
      default: null,
      set: normalizeOptionalString,
    },
    tags: {
      type: [String], // Research keywords/topics
      default: [],
      set: normalizeStringArray,
    },
    citationCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Publication", publicationSchema);