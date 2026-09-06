import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [patientId, setPatientId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill in all required fields");
      return;
    }

    if (role === "patient" && !patientId) {
      alert("Please enter your Patient ID");
      return;
    }

    try {
      setLoading(true);

      const data = await register({
        name,
        email,
        password,
        role,
        patientId: role === "patient" ? patientId : undefined,
      });

      if (!data.success) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful! Please login.");

      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h1>🧠 SMRITI AI</h1>

        <p className="login-subtitle">
          Create Your Account
        </p>

        <label>Name</label>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Email</label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>

        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Account Type</label>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="patient">Patient</option>
          <option value="caregiver">Caregiver</option>
        </select>

        {role === "patient" && (
          <>
            <label>Patient ID</label>

            <input
              type="text"
              placeholder="Enter your Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />

            <p style={{ fontSize: "12px" }}>
              Your caregiver will provide your Patient ID.
            </p>
          </>
        )}

        <button
          className="login-button"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "CREATING ACCOUNT..." : "REGISTER"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          style={{
            marginTop: "10px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Already have an account? Login
        </button>

      </div>
    </div>
  );
}

export default Register;