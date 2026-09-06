import express from "express";
import User from "../models/User";

const router = express.Router();

// Register a user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, patientId } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      patientId,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        patientId: user.patientId,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);

    res.status(500).json({
      success: false,
      message: "Failed to register user",
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        patientId: user.patientId,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

export default router;