import express from "express";
import Memory from "../models/Memory";

const router = express.Router();

// Add a memory
router.post("/", async (req, res) => {
  try {
    const { patientId, title, description, category } = req.body;

    const memory = await Memory.create({
      patientId,
      title,
      description,
      category,
    });

    res.status(201).json({
      success: true,
      message: "Memory created successfully",
      memory,
    });
  } catch (error) {
    console.error("Error creating memory:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create memory",
    });
  }
});

// Get memories for a patient
router.get("/:patientId", async (req, res) => {
  try {
    const memories = await Memory.find({
      patientId: req.params.patientId,
    });

    res.json({
      success: true,
      memories,
    });
  } catch (error) {
    console.error("Error fetching memories:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch memories",
    });
  }
});

export default router;