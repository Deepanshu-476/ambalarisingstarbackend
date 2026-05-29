const mongoose = require("mongoose");

const jplPlayerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    ageCategory: {
      type: String,
      required: true,
    },

    profileLink: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    paymentMethod: {
      type: String,
      default: "qr",
    },

    utrNumber: {
      type: String,
      required: true,
      unique: true,
    },

    aadharNumber: {
      type: String,
      required: true,
      unique: true,
    },

    aadharImage: {
      type: String,
      required: true,
    },

    paymentProof: {
      type: String,
      default: "",
    },

    registrationFee: {
      type: Number,
      default: 1200,
    },

    tournament: {
      type: String,
      default:
        "Junior Premier League Ambala Section 1",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
    
module.exports = mongoose.model(
  "JPLPlayer",
  jplPlayerSchema,
  "jplplayers"
);