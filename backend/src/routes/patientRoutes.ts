import express from "express";
import Patient from "../models/patient";

const router = express.Router();

// Add a new patient
router.post("/", async (req, res) => {
  try {
    const { name, age, language, caregiverId } = req.body;

    const patient = await Patient.create({
      name,
      age,
      language,
      caregiverId,
    });

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      patient,
    });
  } catch (error) {
    console.error("Error creating patient:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create patient",
    });
  }
});

// Get all patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();

    res.json({
      success: true,
      patients,
    });
  } catch (error) {
    console.error("Error fetching patients:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
    });
  }
});

export default router;