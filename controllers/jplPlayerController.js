const JPLPlayer = require("../models/JPLPlayer");
const fs = require("fs");
const path = require("path");
const {
  sendPlayerVerificationEmail
} = require("../utils/emailConfig");

/* =========================
   PAYMENT DETAILS
========================= */
exports.getPaymentDetails = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      registrationFee: 500,
      upiId: "9896529577@ptsbi",
      qrCodeUrl: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment details",
    });
  }
};

/* =========================
   REGISTER PLAYER
========================= */
exports.registerPlayer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      dob,
      ageCategory,
      profileLink,
      role,
      paymentMethod,
      utrNumber,
      aadharNumber,
      tournament,
      paymentStatus,
      verificationStatus,
    } = req.body;

    const existingEmail = await JPLPlayer.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const existingPhone = await JPLPlayer.findOne({ phone });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone already registered",
      });
    }

    const existingUTR = await JPLPlayer.findOne({ utrNumber });

    if (existingUTR) {
      return res.status(400).json({
        success: false,
        message: "UTR already used",
      });
    }

    const passportPhoto =
      req.files?.passportPhoto?.[0]?.filename || "";

    const aadharImage =
      req.files?.aadharImage?.[0]?.filename || "";

    const paymentProof =
      req.files?.paymentProof?.[0]?.filename || "";

    const player = await JPLPlayer.create({
      name,
      email,
      phone,
      dob,
      ageCategory,
      profileLink,
      role,
      paymentMethod,
      utrNumber,
      aadharNumber,
      passportPhoto,
      aadharImage,
      paymentProof,
      tournament,
      paymentStatus,
      verificationStatus,
    });

    return res.status(201).json({
      success: true,
      message: "Player registered successfully",
      playerId: player._id,
      data: player,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

/* =========================
   GET ALL PLAYERS
========================= */
exports.getAllPlayers = async (req, res) => {
  try {
    const players = await JPLPlayer.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      totalPlayers: players.length,
      data: players,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch players",
    });
  }
};

/* =========================
   GET SINGLE PLAYER
========================= */
exports.getSinglePlayer = async (req, res) => {
  try {
    const player = await JPLPlayer.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: player,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch player",
    });
  }
};

/* =========================
   UPDATE PLAYER
========================= */
exports.updatePlayer = async (req, res) => {
  try {
    const player = await JPLPlayer.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    const {
      name,
      email,
      phone,
      dob,
      ageCategory,
      profileLink,
      role,
      paymentMethod,
      utrNumber,
      aadharNumber,
      paymentStatus,
      verificationStatus,
    } = req.body;

    // IMAGE UPDATE
    if (req.files?.passportPhoto?.[0]) {
      if (player.passportPhoto) {
        const oldPath = path.join(
          __dirname,
          "../uploads/captains",
          player.passportPhoto
        );

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      player.passportPhoto =
        req.files.passportPhoto[0].filename;
    }

    if (req.files?.aadharImage?.[0]) {
      if (player.aadharImage) {
        const oldPath = path.join(
          __dirname,
          "../uploads/captains",
          player.aadharImage
        );

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      player.aadharImage =
        req.files.aadharImage[0].filename;
    }

    if (req.files?.paymentProof?.[0]) {
      if (player.paymentProof) {
        const oldPath = path.join(
          __dirname,
          "../uploads/captains",
          player.paymentProof
        );

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      player.paymentProof =
        req.files.paymentProof[0].filename;
    }

    player.name = name || player.name;
    player.email = email || player.email;
    player.phone = phone || player.phone;
    player.dob = dob || player.dob;
    player.ageCategory =
      ageCategory || player.ageCategory;
    player.profileLink =
      profileLink || player.profileLink;
    player.role = role || player.role;
    player.paymentMethod =
      paymentMethod || player.paymentMethod;
    player.utrNumber =
      utrNumber || player.utrNumber;
    player.aadharNumber =
      aadharNumber || player.aadharNumber;
    player.paymentStatus =
      paymentStatus || player.paymentStatus;
    player.verificationStatus =
      verificationStatus ||
      player.verificationStatus;

    await player.save();

console.log("PLAYER UPDATED SUCCESS");

console.log("EMAIL FUNCTION START");

/* =========================
   SEND EMAIL
========================= */
if (
  player.paymentStatus === "verified" ||
  player.paymentStatus === "rejected"
) {

  await sendPlayerVerificationEmail({
    name: player.name,
    email: player.email,
    paymentStatus: player.paymentStatus,
    utrNumber: player.utrNumber,
  });

  console.log("EMAIL SENT SUCCESS");
}

return res.status(200).json({
  success: true,
  message: "Player updated successfully",
  data: player,
});
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

/* =========================
   DELETE PLAYER
========================= */
exports.deletePlayer = async (req, res) => {
  try {
    const player = await JPLPlayer.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    // DELETE IMAGES
    const files = [
      player.passportPhoto,
      player.aadharImage,
      player.paymentProof,
    ];

    files.forEach((file) => {
      if (file) {
        const filePath = path.join(
          __dirname,
          "../uploads/captains",
          file
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    await player.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Player deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};