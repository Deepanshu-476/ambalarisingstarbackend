// controllers/adminSlot.controller.js
const Slot = require("../models/Slot");

const startOfDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

/* ================= CREATE SLOT ================= */
exports.createSlot = async (req, res) => {
  try {
    const { slotDate, startTime, endTime, capacity } = req.body;

    const date = startOfDay(slotDate);
    const result = await Slot.findOneAndUpdate(
      { slotDate: date, startTime, endTime },
      { $setOnInsert: { slotDate: date, startTime, endTime, capacity: capacity || 2 } },
      { new: true, upsert: true, setDefaultsOnInsert: true, rawResult: true }
    );
    const slot = result.value || result;
    const created = Boolean(result.lastErrorObject?.upserted);

    res.status(created ? 201 : 200).json({
      success: true,
      message: created ? "Slot created successfully" : "Slot already exists for this date & time",
      data: slot,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= BULK FUTURE SLOT GENERATION ================= */
exports.generateFutureSlots = async (req, res) => {
  try {
    const { startDate, endDate, timeSlots, capacity = 2 } = req.body;
    const currentDate = startOfDay(startDate);
    const lastDate = startOfDay(endDate);

    if (!startDate || !endDate || currentDate > lastDate || !Array.isArray(timeSlots) || timeSlots.length === 0) {
      return res.status(400).json({ success: false, message: "Provide a valid date range and at least one time slot" });
    }

    const operationsByKey = new Map();

    while (currentDate <= lastDate) {
      for (const t of timeSlots) {
        if (!t?.startTime || !t?.endTime || t.startTime >= t.endTime) {
          return res.status(400).json({ success: false, message: "Each slot needs a valid start and end time" });
        }

        const slotDate = new Date(currentDate);
        const key = `${slotDate.toISOString()}-${t.startTime}-${t.endTime}`;
        operationsByKey.set(key, {
          updateOne: {
            filter: { slotDate, startTime: t.startTime, endTime: t.endTime },
            update: { $setOnInsert: { slotDate, startTime: t.startTime, endTime: t.endTime, capacity } },
            upsert: true,
          },
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const operations = [...operationsByKey.values()];
    let created = 0;
    try {
      if (operations.length) {
        const result = await Slot.bulkWrite(operations, { ordered: false });
        created = result.upsertedCount || 0;
      }
    } catch (error) {
      if (error.code !== 11000) throw error;
    }

    res.json({
      success: true,
      message: created ? "Future slots generated successfully" : "All requested slots already exist",
      totalSlots: created,
      requestedSlots: operations.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= DISABLE ALL SLOTS BY DATE ================= */
exports.disableSlotsByDate = async (req, res) => {
  try {
    const { slotDate } = req.body;

    const date = new Date(slotDate);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const result = await Slot.updateMany(
      {
        slotDate: { $gte: date, $lt: nextDate },
      },
      { $set: { isDisabled: true } }
    );

    res.json({
      success: true,
      message: "All slots disabled for this date",
      modified: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET ALL SLOTS ================= */
exports.getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.find().sort({ slotDate: 1, startTime: 1 });

    res.json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET SINGLE SLOT ================= */
exports.getSlotById = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ success: false, message: "Slot not found" });
    }

    res.json({ success: true, data: slot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE SLOT ================= */
exports.updateSlot = async (req, res) => {
  try {
    const slot = await Slot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!slot) {
      return res.status(404).json({ success: false, message: "Slot not found" });
    }

    res.json({
      success: true,
      message: "Slot updated successfully",
      data: slot,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= DELETE SLOT ================= */
exports.deleteSlot = async (req, res) => {
  try {
    const slot = await Slot.findByIdAndDelete(req.params.id);

    if (!slot) {
      return res.status(404).json({ success: false, message: "Slot not found" });
    }

    res.json({ success: true, message: "Slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= ENABLE / DISABLE SINGLE SLOT ================= */
exports.toggleSlotStatus = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ success: false, message: "Slot not found" });
    }

    slot.isDisabled = !slot.isDisabled;
    await slot.save();

    res.json({
      success: true,
      message: `Slot ${slot.isDisabled ? "Disabled" : "Enabled"} successfully`,
      data: slot,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
