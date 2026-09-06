import { useNavigate } from "react-router-dom";

function PatientHome() {

  const navigate = useNavigate();

  return (
    <div className="home-container">

      <h1>Good Morning ❤️</h1>

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