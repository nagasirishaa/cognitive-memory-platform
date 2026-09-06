import { useEffect, useState } from "react";

type Card = {
  id: number;
  emoji: string;
  matched: boolean;
};

const emojis = ["🍎", "🐘", "🚗", "🌸", "🏠", "🐱"];

function createCards(): Card[] {
  const cards = [...emojis, ...emojis]
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({
      id: index,
      emoji,
      matched: false,
    }));

  return cards;
}

function MatchingGame() {
  const [cards, setCards] = useState<Card[]>(createCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [time, setTime] = useState(0);
  const [locked, setLocked] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Timer
  useEffect(() => {
    if (gameCompleted) return;

    const timer = setInterval(() => {
      setTime((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameCompleted]);

  // Check selected cards
  useEffect(() => {
    if (selected.length !== 2) return;

    setLocked(true);
    setAttempts((previous) => previous + 1);

    const first = cards[selected[0]];
    const second = cards[selected[1]];

    if (first.emoji === second.emoji) {
      setTimeout(() => {
        setCards((previousCards) =>
          previousCards.map((card) =>
            card.id === first.id || card.id === second.id
              ? { ...card, matched: true }
              : card
          )
        );

        setScore((previous) => previous + 10);
        setSelected([]);
        setLocked(false);
      }, 500);
    } else {
      setTimeout(() => {
        setSelected([]);
        setLocked(false);
      }, 1000);
    }
  }, [selected, cards]);

  // Check game completion
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.matched)) {
      setGameCompleted(true);
    }
  }, [cards]);

  const handleCardClick = (index: number) => {
    if (locked) return;

    if (selected.includes(index)) return;

    if (cards[index].matched) return;

    if (selected.length === 2) return;

    setSelected((previous) => [...previous, index]);
  };

  const restartGame = () => {
    setCards(createCards());
    setSelected([]);
    setScore(0);
    setAttempts(0);
    setTime(0);
    setLocked(false);
    setGameCompleted(false);
  };

  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const accuracy =
    attempts === 0 ? 0 : Math.round((score / 10 / attempts) * 100);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🧠 Memory Match</h1>
          <p style={styles.subtitle}>
            Find all the matching pairs!
          </p>
        </div>

        <button style={styles.homeButton} onClick={() => window.history.back()}>
          ← Back
        </button>
      </div>

      {/* Score information */}
      <div style={styles.statsContainer}>
        <div style={styles.statBox}>
          <span style={styles.statEmoji}>🏆</span>
          <div>
            <div style={styles.statLabel}>Score</div>
            <div style={styles.statValue}>{score}</div>
          </div>
        </div>

        <div style={styles.statBox}>
          <span style={styles.statEmoji}>🎯</span>
          <div>
            <div style={styles.statLabel}>Attempts</div>
            <div style={styles.statValue}>{attempts}</div>
          </div>
        </div>

        <div style={styles.statBox}>
          <span style={styles.statEmoji}>⏱️</span>
          <div>
            <div style={styles.statLabel}>Time</div>
            <div style={styles.statValue}>{formatTime()}</div>
          </div>
        </div>

        <div style={styles.statBox}>
          <span style={styles.statEmoji}>⭐</span>
          <div>
            <div style={styles.statLabel}>Accuracy</div>
            <div style={styles.statValue}>{accuracy}%</div>
          </div>
        </div>
      </div>

      {/* Game board */}
      <div style={styles.gameBoard}>
        {cards.map((card, index) => {
          const isSelected = selected.includes(index);

          const isVisible = isSelected || card.matched;

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              style={{
                ...styles.card,
                ...(isVisible ? styles.cardOpen : styles.cardHidden),
                ...(card.matched ? styles.cardMatched : {}),
              }}
            >
              {isVisible ? (
                <span style={styles.emoji}>{card.emoji}</span>
              ) : (
                <span style={styles.question}>?</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Instructions */}
      {!gameCompleted && (
        <div style={styles.instruction}>
          💡 Tap two cards to find a matching pair
        </div>
      )}

      {/* Completion */}
      {gameCompleted && (
        <div style={styles.successBox}>
          <div style={styles.trophy}>🎉</div>

          <h2 style={styles.successTitle}>Excellent!</h2>

          <p style={styles.successText}>
            You found all the matching pairs!
          </p>

          <div style={styles.finalScore}>
            <span>🏆 Score: {score}</span>
            <span>🎯 Attempts: {attempts}</span>
            <span>⏱️ Time: {formatTime()}</span>
          </div>

          <button style={styles.restartButton} onClick={restartGame}>
            🔄 Play Again
          </button>
        </div>
      )}

      {/* Restart */}
      {!gameCompleted && (
        <button style={styles.restartSmall} onClick={restartGame}>
          🔄 Restart Game
        </button>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    boxSizing: "border-box",
    background:
      "linear-gradient(135deg, #eef4ff 0%, #f8f1ff 50%, #fff7e8 100%)",
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
    fontSize: "22px",
    marginTop: "8px",
    color: "#555",
  },

  homeButton: {
    padding: "14px 22px",
    fontSize: "18px",
    borderRadius: "12px",
    border: "none",
    background: "#ffffff",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
  },

  statsContainer: {
    maxWidth: "1000px",
    margin: "0 auto 30px",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
  },

  statBox: {
    background: "white",
    borderRadius: "18px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxShadow: "0 5px 18px rgba(0,0,0,0.10)",
  },

  statEmoji: {
    fontSize: "32px",
  },

  statLabel: {
    fontSize: "16px",
    color: "#777",
  },

  statValue: {
    fontSize: "25px",
    fontWeight: "bold",
    color: "#243b64",
  },

  gameBoard: {
    maxWidth: "700px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "18px",
  },

  card: {
    height: "145px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 7px 15px rgba(0,0,0,0.15)",
  },

  cardHidden: {
    background: "linear-gradient(135deg, #5b6ee1, #8e7dff)",
    color: "white",
  },

  cardOpen: {
    background: "white",
    transform: "scale(1.03)",
  },

  cardMatched: {
    background: "#e8f8ec",
    border: "4px solid #58b368",
  },

  question: {
    fontSize: "55px",
    fontWeight: "bold",
    color: "white",
  },

  emoji: {
    fontSize: "65px",
  },

  instruction: {
    maxWidth: "700px",
    margin: "25px auto",
    padding: "18px",
    textAlign: "center",
    borderRadius: "15px",
    background: "white",
    fontSize: "20px",
    color: "#555",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  successBox: {
    maxWidth: "650px",
    margin: "30px auto",
    padding: "35px",
    textAlign: "center",
    borderRadius: "25px",
    background: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },

  trophy: {
    fontSize: "70px",
  },

  successTitle: {
    fontSize: "38px",
    margin: "10px 0",
    color: "#243b64",
  },

  successText: {
    fontSize: "21px",
    color: "#555",
  },

  finalScore: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
    margin: "25px 0",
    fontSize: "18px",
    fontWeight: "bold",
  },

  restartButton: {
    padding: "16px 30px",
    borderRadius: "14px",
    border: "none",
    background: "#5b6ee1",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
  },

  restartSmall: {
    display: "block",
    margin: "25px auto",
    padding: "14px 25px",
    borderRadius: "12px",
    border: "none",
    background: "white",
    fontSize: "18px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
  },
};

export default MatchingGame;