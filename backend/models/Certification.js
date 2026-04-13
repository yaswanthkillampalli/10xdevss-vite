const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Certification title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    issuingOrganization: {
      type: String,
      required: [true, "Issuing organization is required"],
      trim: true,
      maxlength: [100, "Organization name cannot exceed 100 characters"],
    },
    issueDate: {
      type: Date,
      required: [true, "Issue date is required"],
    },
    expiryDate: {
      type: Date,
      default: null, // null = no expiry
    },
    credentialId: {
      type: String,
      trim: true,
      default: null,
    },
    credentialUrl: {
      type: String,
      trim: true,
      default: null,
    },
    badgeImage: {
      type: String, // URL
      default: null,
    },
  },
  { timestamps: true }
);

// Ensure expiry is after issue date
certificationSchema.pre("save", function (next) {
  if (this.expiryDate && this.expiryDate <= this.issueDate) {
    return next(new Error("Expiry date must be after issue date"));
  }
  next();
});

module.exports = mongoose.model("Certification", certificationSchema);