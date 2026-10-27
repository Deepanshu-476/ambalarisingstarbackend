const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* FIXED ADMIN */
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";

exports.register = async (req, res) => {
  try {
    const { name, email, phoneNo, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email is already registered. Please sign in." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phoneNo,
      password: hashedPassword,
      role: "teamCaptain"
    });

    res.status(201).json({ success: true, message: "Team Captain Registered", user });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ success: false, message: error.message || "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* =========================
       🔍 DEBUG LOGS (ADMIN CHECK)
    ========================= */
    console.log("🔹 Incoming Email:", email);
    console.log("🔹 Incoming Password:", password ? "✔ Provided" : "❌ Missing");

    console.log("🔹 ENV ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
    console.log(
      "🔹 ENV ADMIN_PASSWORD:",
      process.env.ADMIN_PASSWORD ? "✔ Exists" : "❌ Missing"
    );

    console.log(
      "🔹 Email Match:",
      email === process.env.ADMIN_EMAIL
    );

    console.log(
      "🔹 Password Match:",
      password === process.env.ADMIN_PASSWORD
    );

    /* =========================
       1️⃣ ADMIN LOGIN
    ========================= */
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      console.log("✅ ADMIN LOGIN MATCHED FROM .env");

      const adminUser = await User.findOneAndUpdate(
        { email: process.env.ADMIN_EMAIL },
        {
          $set: { name: "Admin", role: "admin" },
          $setOnInsert: { email: process.env.ADMIN_EMAIL },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      const token = jwt.sign(
        { id: adminUser._id.toString(), role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        token,
        role: "admin",
        user: {
          _id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: "admin"
        }
      });
    }

    console.log("➡️ Not admin, checking normal user login");

    /* =========================
       2️⃣ USER LOGIN
    ========================= */
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    /* =========================
       3️⃣ PASSWORD CHECK
    ========================= */
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔹 User Password Match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    /* =========================
       4️⃣ JWT TOKEN
    ========================= */
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    /* =========================
       5️⃣ RESPONSE
    ========================= */
    return res.json({
      token,
      role: user.role,
      paymentStatus: user.paymentStatus,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    });

  } catch (error) {
    console.error("🔥 Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



