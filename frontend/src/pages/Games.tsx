import { useNavigate } from "react-router-dom";

function Games() {

  const navigate = useNavigate();

  return (
    <div className="page-container">

      <h1>🧠 Memory Games</h1>

      <div className="game-menu">

        <button
          className="big-button"
          onClick={() =>
            navigate("/games/matching")
          }
        >
          🧩 Memory Matching
        </button>

        <button
          className="big-button"
          onClick={() =>
            navigate("/games/sequence")
          }
        >
          🔢 Sequence Memory
        </button>

        <button
          className="big-button"
          onClick={() =>
            navigate("/games/family")
          }
        >
          👨‍👩‍👧 Family Memory
        </button>

      </div>

    </div>
  );
}

export default Games;