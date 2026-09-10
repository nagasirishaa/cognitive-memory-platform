import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import patientRoutes from "./routes/patientRoutes";
import familyMemberRoutes from "./routes/familyMemberRoutes";
import memoryRoutes from "./routes/memoryRoutes";
import reminderRoutes from "./routes/reminderRoutes";
import gameSessionRoutes from "./routes/gamesessionRoutes";
import recommendationRoutes from "./routes/recommendationRoutes";
import authRoutes from "./routes/authRoutes";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/patients", patientRoutes);
app.use("/api/family", familyMemberRoutes);
app.use("/api/memories", memoryRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/game-sessions", gameSessionRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/auth", authRoutes);
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Cognitive Memory Platform backend is running",
  });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is missing from .env");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });