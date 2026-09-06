import { useState } from "react";
import VoiceButton from "../components/VoiceButton";
import { askAssistant } from "../services/api";

function MemoryAssistant() {

  const [question, setQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleAsk = async () => {

    if (!question.trim()) {
      return;
    }

    setLoading(true);

    const response =
      await askAssistant(question);

    setAnswer(response.answer);

    setLoading(false);
  };

  return (
    <div className="assistant-container">

      <h1>🗣️ Memory Assistant</h1>

      <p className="assistant-description">
        You can ask me about your family
        and memories.
      </p>

      <div className="question-box">

        <input
          type="text"
          placeholder="Who is Ravi?"
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
        />

        <button
          className="ask-button"
          onClick={handleAsk}
        >
          ASK
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

          <h2>🤖 AI:</h2>

          <p>{answer}</p>

          <button
            className="speak-button"
            onClick={() => {
              const speech =
                new SpeechSynthesisUtterance(
                  answer
                );

              speechSynthesis.speak(speech);
            }}
          >
            🔊 READ ALOUD
          </button>

        </div>

      )}

    </div>
  );
}

export default MemoryAssistant;