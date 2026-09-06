import express from "express";
import Reminder from "../models/Reminder";

const router = express.Router();

// Add a reminder
router.post("/", async (req, res) => {
  try {
    const { patientId, title, description, date, time } = req.body;

    const reminder = await Reminder.create({
      patientId,
      title,
      description,
      date,
      time,
    });

    res.status(201).json({
      success: true,
      message: "Reminder created successfully",
      reminder,
    });
  } catch (error) {
    console.error("Error creating reminder:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create reminder",
    });
  }
});

// Get reminders for a patient
router.get("/:patientId", async (req, res) => {
  try {
    const reminders = await Reminder.find({
      patientId: req.params.patientId,
    });

    res.json({
      success: true,
      reminders,
    });
  } catch (error) {
    console.error("Error fetching reminders:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch reminders",
    });
  }
});

export default router;