import express from "express";
import FamilyMember from "../models/FamilyMember";

const router = express.Router();

// Add a family member
router.post("/", async (req, res) => {
  try {
    const { patientId, name, relationship, age } = req.body;

    const familyMember = await FamilyMember.create({
      patientId,
      name,
      relationship,
      age,
    });

    res.status(201).json({
      success: true,
      message: "Family member created successfully",
      familyMember,
    });
  } catch (error) {
    console.error("Error creating family member:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create family member",
    });
  }
});

// Get family members for a patient
router.get("/:patientId", async (req, res) => {
  try {
    const familyMembers = await FamilyMember.find({
      patientId: req.params.patientId,
    });

    res.json({
      success: true,
      familyMembers,
    });
  } catch (error) {
    console.error("Error fetching family members:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch family members",
    });
  }
});

export default router;