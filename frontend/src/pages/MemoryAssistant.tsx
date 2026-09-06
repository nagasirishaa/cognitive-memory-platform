import { useState } from "react";
import VoiceButton from "../components/VoiceButton";
import { askAssistant } from "../services/api";

function MemoryAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // Get the currently logged-in patient
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const patientId = user?.patientId;

  const handleAsk = async () => {
    if (!question.trim()) {
      return;
    }

    if (!patientId) {
      setAnswer(
        "I could not find your patient information. Please log in again."
      );
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await askAssistant(
        question,
        patientId
      );

      setAnswer(response.answer);
    } catch (error) {
      console.error(
        "Failed to ask memory assistant:",
        error
      );

      setAnswer(
        "Sorry, I could not access your memories right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReadAloud = () => {
    if (!answer) {
      return;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const speech =
        new SpeechSynthesisUtterance(answer);

      speech.lang = "en-IN";
      speech.rate = 0.9;
      speech.pitch = 1;

      window.speechSynthesis.speak(speech);
    }
  };

  return (
    <div className="assistant-container">

      <h1>🗣️ Memory Assistant</h1>

      <p className="assistant-description">
        You can ask me about your family and memories.
      </p>

      <div className="question-box">

        <input
          type="text"
          placeholder="Who is Saly?"
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAsk();
            }
          }}
        />

        <button
          className="ask-button"
          onClick={handleAsk}
          disabled={loading}
        >
          {loading ? "THINKING..." : "ASK"}
        </button>

      </div>

      <VoiceButton
        onText={(text) => setQuestion(text)}
      />

      {loading && (
        <p>Thinking...</p>
      )}

      {answer && (
        <div className="ai-answer">

          <h2>🤖 Memory Assistant:</h2>

          <p>{answer}</p>

          <button
            className="speak-button"
            onClick={handleReadAloud}
          >
            🔊 READ ALOUD
          </button>

        </div>
      )}

    </div>
  );
}

export default MemoryAssistant;