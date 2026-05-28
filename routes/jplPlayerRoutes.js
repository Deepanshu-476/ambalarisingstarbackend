const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
  registerPlayer,
  getPaymentDetails,
  getAllPlayers,
  getSinglePlayer,
  updatePlayer,
  deletePlayer,
} = require("../controllers/jplPlayerController");

/* =========================
   PAYMENT
========================= */
router.get(
  "/payment-details",
  getPaymentDetails
);

/* =========================
   CREATE PLAYER
========================= */
router.post(
  "/register",
  upload.fields([
    {
      name: "aadharImage",
      maxCount: 1,
    },
    {
      name: "paymentProof",
      maxCount: 1,
    },
  ]),
  registerPlayer
);

/* =========================
   GET ALL PLAYERS
========================= */
router.get("/all", getAllPlayers);

/* =========================
   GET SINGLE PLAYER
========================= */
router.get("/:id", getSinglePlayer);

/* =========================
   UPDATE PLAYER
========================= */
router.put(
  "/update/:id",
  upload.fields([
    
    {
      name: "aadharImage",
      maxCount: 1,
    },
    {
      name: "paymentProof",
      maxCount: 1,
    },
  ]),
  updatePlayer
);

/* =========================
   DELETE PLAYER
========================= */
router.delete(
  "/delete/:id",
  deletePlayer
);

module.exports = router;    