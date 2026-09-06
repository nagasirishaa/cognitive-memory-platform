import express from "express";
import Recommendation from "../models/Recommendation";

const router = express.Router();

// Create a recommendation
router.post("/", async (req, res) => {
  try {
    const {
      patientId,
      gameName,
      currentDifficulty,
      recommendedDifficulty,
      reason,
      accuracy,
    } = req.body;

    const recommendation = await Recommendation.create({
      patientId,
      gameName,
      currentDifficulty,
      recommendedDifficulty,
      reason,
      accuracy,
    });

    res.status(201).json({
      success: true,
      message: "Recommendation created successfully",
      recommendation,
    });
  } catch (error) {
    console.error("Error creating recommendation:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create recommendation",
    });
  }
});

// Get recommendations for a patient
router.get("/:patientId", async (req, res) => {
  try {
    const recommendations = await Recommendation.find({
      patientId: req.params.patientId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recommendations",
    });
  }
});

export default router;