import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const data = await login(email, password);

      if (!data.success) {
        alert(data.message || "Invalid email or password");
        return;
      }

      // Save logged-in user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Redirect according to user role
      if (data.user.role === "caregiver") {
        navigate("/caregiver");
      } else if (data.user.role === "patient") {
        navigate("/home");
      } else {
        alert("Unknown user role");
      }
    } catch (error) {
      console.error("Login failed:", error);

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
          Your Memory Companion
        </p>

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
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "LOGGING IN..." : "LOGIN"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/register")}
          style={{
            marginTop: "10px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Don't have an account? Register
        </button>

      </div>
    </div>
  );
}

export default Login;