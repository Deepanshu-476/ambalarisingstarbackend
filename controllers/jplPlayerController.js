const JPLPlayer = require("../models/JPLPlayer");
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
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
     registrationFee: 1200,
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

    const today = new Date();

const birthDate = new Date(dob);

let age =
  today.getFullYear() -
  birthDate.getFullYear();

const monthDiff =
  today.getMonth() -
  birthDate.getMonth();

if (
  monthDiff < 0 ||
  (
    monthDiff === 0 &&
    today.getDate() < birthDate.getDate()
  )
) {
  age--;
}

if (age < 10) {

  return res.status(400).json({
    success: false,
    message:
      "Player must be at least 10 years old"
  });

}

if (age > 40) {

  return res.status(400).json({
    success: false,
    message:
      "Player age cannot exceed 40 years"
  });

}

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

      if (!req.files?.aadharImage) {

        return res.status(400).json({
          success: false,
          message: "Aadhar image is required"
        });

      }

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
  aadharImage,
  paymentProof,
  registrationFee: 1200,
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
   EXPORT PLAYERS TO EXCEL
========================= */
exports.exportPlayers = async (req, res) => {
  try {
    const {
      status,
      role,
      category,
      search,
      startDate,
      endDate,
    } = req.query;

    const query = {};

    if (status && status !== "all") query.paymentStatus = status;
    if (role && role !== "all") query.role = role;
    if (category && category !== "all") query.ageCategory = category;

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { utrNumber: searchRegex },
        { aadharNumber: searchRegex },
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const players = await JPLPlayer.find(query).sort({ createdAt: -1 });

    if (players.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No players found for export",
      });
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Junior Premier League Ambala";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Ambala Registrations");

    worksheet.columns = [
      { header: "S.No", key: "sno", width: 8 },
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Date of Birth", key: "dob", width: 18 },
      { header: "Age Category", key: "ageCategory", width: 18 },
      { header: "Role", key: "role", width: 18 },
      { header: "CricHeroes Profile Link", key: "profileLink", width: 45 },
      { header: "Aadhar Number", key: "aadharNumber", width: 18 },
      { header: "Aadhar Image", key: "aadharImage", width: 28 },
      { header: "UTR Number", key: "utrNumber", width: 22 },
      { header: "Payment Method", key: "paymentMethod", width: 18 },
      { header: "Payment Proof", key: "paymentProof", width: 28 },
      { header: "Registration Fee", key: "registrationFee", width: 18 },
      { header: "Tournament", key: "tournament", width: 38 },
      { header: "Payment Status", key: "paymentStatus", width: 18 },
      { header: "Verification Status", key: "verificationStatus", width: 20 },
      { header: "Registered Date", key: "createdAt", width: 20 },
      { header: "Updated Date", key: "updatedAt", width: 20 },
    ];

    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFF" } };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "2F5597" },
    };
    worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

    players.forEach((player, index) => {
      const row = worksheet.addRow({
        sno: index + 1,
        name: player.name || "",
        email: player.email || "",
        phone: player.phone || "",
        dob: player.dob ? player.dob.toLocaleDateString("en-IN") : "",
        ageCategory: player.ageCategory || "",
        role: player.role || "",
        profileLink: player.profileLink || "",
        aadharNumber: player.aadharNumber || "",
        aadharImage: player.aadharImage || "",
        utrNumber: player.utrNumber || "",
        paymentMethod: player.paymentMethod === "qr" ? "QR Code" : player.paymentMethod || "",
        paymentProof: player.paymentProof || "",
        registrationFee: player.registrationFee || 1200,
        tournament: player.tournament || "Junior Premier League Ambala Section 1",
        paymentStatus: player.paymentStatus || "",
        verificationStatus: player.verificationStatus || "",
        createdAt: player.createdAt ? player.createdAt.toLocaleDateString("en-IN") : "",
        updatedAt: player.updatedAt ? player.updatedAt.toLocaleDateString("en-IN") : "",
      });

      const statusCell = row.getCell("paymentStatus");
      if (player.paymentStatus === "verified") {
        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "C6EFCE" },
        };
      } else if (player.paymentStatus === "pending") {
        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFEB9C" },
        };
      } else if (player.paymentStatus === "rejected") {
        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFC7CE" },
        };
      }
    });

    worksheet.autoFilter = {
      from: "A1",
      to: `S${players.length + 1}`,
    };
    worksheet.views = [{ state: "frozen", xSplit: 0, ySplit: 1 }];

    const fileName = `junior-premier-league-ambala-registrations-${new Date()
      .toISOString()
      .split("T")[0]}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("JPL Export Players Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to export data",
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

await player.save({ validateBeforeSave: false });

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
