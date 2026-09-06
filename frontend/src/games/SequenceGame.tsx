import { useEffect, useState } from "react";

const sequenceItems = ["🍎", "🐘", "🚗", "🌸"];

function SequenceGame() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSequence, setShowSequence] = useState(true);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    startRound();
  }, []);

  const startRound = () => {
    setSequence(sequenceItems);
    setCurrentIndex(0);
    setShowSequence(true);
    setMessage("");

    setTimeout(() => {
      setShowSequence(false);
    }, 5000);
  };

  const handleAnswer = (index: number) => {
    if (showSequence) return;

    if (index === currentIndex) {
      setScore((previous) => previous + 10);
      setMessage("✅ Correct! Well done!");

      if (currentIndex === sequence.length - 1) {
        setMessage("🎉 Excellent! You remembered the whole sequence!");

        setTimeout(() => {
          setQuestionNumber((previous) => previous + 1);
          startRound();
        }, 1500);
      } else {
        setCurrentIndex((previous) => previous + 1);
      }
    } else {
      setMessage("❌ Not quite. Try the next one!");

      setTimeout(() => {
        setMessage("");
      }, 1200);
    }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🧠 Sequence Memory</h1>
          <p style={styles.subtitle}>
            Remember the order of the objects
          </p>
        </div>

        <button
          style={styles.backButton}
          onClick={() => {
            window.location.href = "/games";
          }}
        >
          ← Games
        </button>
      </div>

      {/* Score */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          🏆
          <span>
            Score
            <strong>{score}</strong>
          </span>
        </div>

        <div style={styles.statCard}>
          🔢
          <span>
            Round
            <strong>{questionNumber}</strong>
          </span>
        </div>
      </div>

      {/* Main Game */}
      <div style={styles.gameCard}>
        {showSequence ? (
          <>
            <div style={styles.icon}>👀</div>

            <h2 style={styles.heading}>
              Remember this sequence!
            </h2>

            <p style={styles.instruction}>
              Look carefully. You have 5 seconds.
            </p>

            <div style={styles.sequenceBox}>
              {sequence.map((item, index) => (
                <div key={index} style={styles.sequenceItem}>
                  {item}
                </div>
              ))}
            </div>

            <div style={styles.timerText}>
              ⏳ Memorizing...
            </div>
          </>
        ) : (
          <>
            <div style={styles.icon}>🤔</div>

            <h2 style={styles.heading}>
              What came next?
            </h2>

            <p style={styles.instruction}>
              Select the correct object.
            </p>

            <div style={styles.options}>
              {sequenceItems.map((item, index) => (
                <button
                  key={index}
                  style={styles.optionButton}
                  onClick={() => handleAnswer(index)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div style={styles.progress}>
              Question {currentIndex + 1} of {sequence.length}
            </div>
          </>
        )}

        {message && (
          <div style={styles.message}>
            {message}
          </div>
        )}
      </div>

      {/* Restart */}
      <button
        style={styles.restartButton}
        onClick={startRound}
      >
        🔄 Restart
      </button>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    boxSizing: "border-box",
    background:
      "linear-gradient(135deg, #eef4ff, #f8f1ff, #fff7e8)",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    maxWidth: "1000px",
    margin: "0 auto 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    margin: 0,
    fontSize: "42px",
    color: "#243b64",
  },

  subtitle: {
    fontSize: "21px",
    color: "#555",
    marginTop: "8px",
  },

  backButton: {
    padding: "14px 24px",
    fontSize: "18px",
    border: "none",
    borderRadius: "14px",
    background: "white",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
  },

  stats: {
    maxWidth: "700px",
    margin: "0 auto 25px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },

  statCard: {
    background: "white",
    padding: "18px 30px",
    borderRadius: "18px",
    fontSize: "28px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 5px 18px rgba(0,0,0,0.10)",
  },

  statCardSpan: {
    fontSize: "16px",
  },

  gameCard: {
    maxWidth: "800px",
    minHeight: "450px",
    margin: "0 auto",
    background: "white",
    borderRadius: "30px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
    boxSizing: "border-box",
  },

  icon: {
    fontSize: "65px",
  },

  heading: {
    fontSize: "32px",
    color: "#243b64",
    margin: "15px 0 10px",
  },

  instruction: {
    fontSize: "20px",
    color: "#666",
  },

  sequenceBox: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    margin: "35px 0",
  },

  sequenceItem: {
    width: "100px",
    height: "100px",
    borderRadius: "20px",
    background: "#eef1ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "55px",
    boxShadow: "0 5px 12px rgba(0,0,0,0.12)",
  },

  timerText: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#5b6ee1",
  },

  options: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    maxWidth: "450px",
    margin: "30px auto",
  },

  optionButton: {
    height: "110px",
    border: "none",
    borderRadius: "20px",
    background: "#eef1ff",
    fontSize: "55px",
    cursor: "pointer",
    boxShadow: "0 5px 12px rgba(0,0,0,0.12)",
  },

  progress: {
    fontSize: "18px",
    color: "#777",
    marginTop: "20px",
  },

  message: {
    marginTop: "25px",
    padding: "15px",
    borderRadius: "15px",
    background: "#f3f7ff",
    fontSize: "21px",
    fontWeight: "bold",
  },

  restartButton: {
    display: "block",
    margin: "25px auto",
    padding: "15px 30px",
    border: "none",
    borderRadius: "14px",
    background: "white",
    fontSize: "19px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
  },
};

export default SequenceGame;