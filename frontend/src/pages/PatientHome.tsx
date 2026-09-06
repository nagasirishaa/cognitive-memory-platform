import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPatient } from "../services/api";

function PatientHome() {
  const navigate = useNavigate();

  const [patientName, setPatientName] = useState("Patient");
  const [patientLanguage, setPatientLanguage] =
    useState("English");

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const patientId = user?.patientId;

  useEffect(() => {
    async function loadPatient() {
      if (!patientId) return;

      try {
        const data = await getPatient(patientId);

        if (data.success && data.patient) {
          setPatientName(data.patient.name);
          setPatientLanguage(data.patient.language);
        }
      } catch (error) {
        console.error(
          "Failed to load patient:",
          error
        );
      }
    }

    loadPatient();
  }, [patientId]);

  return (
    <div className="home-container">
      <h1>Good Morning ❤️</h1>

      <h2>Hello, {patientName}</h2>

      <p>Language: {patientLanguage}</p>

      <h2>What would you like to do?</h2>

      <div className="home-grid">
        <button
          className="big-home-button"
          onClick={() => navigate("/games")}
        >
          🧠
          <span>GAMES</span>
        </button>

        <button
          className="big-home-button"
          onClick={() => navigate("/assistant")}
        >
          🗣️
          <span>TALK</span>
        </button>

        <button
          className="big-home-button"
          onClick={() => navigate("/family")}
        >
          👨‍👩‍👧
          <span>FAMILY</span>
        </button>

        <button
          className="big-home-button"
          onClick={() => navigate("/reminders")}
        >
          🔔
          <span>REMINDERS</span>
        </button>

        <button
          className="big-home-button"
          onClick={() => navigate("/progress")}
        >
          📊
          <span>PROGRESS</span>
        </button>
      </div>
    </div>
  );
}

export default PatientHome;