import { useState } from "react";

interface VoiceButtonProps {
  onText: (text: string) => void;
}

function VoiceButton({
  onText,
}: VoiceButtonProps) {

  const [listening, setListening] =
    useState(false);

  const startListening = () => {

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {

      alert(
        "Speech recognition is not supported in this browser."
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;

    setListening(true);

    recognition.start();

    recognition.onresult = (
      event: any
    ) => {

      const text =
        event.results[0][0].transcript;

      onText(text);

      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
      alert("Could not understand your voice.");
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  return (
    <button
      className="voice-button"
      onClick={startListening}
    >
      {listening
        ? "🔴 Listening..."
        : "🎤 Speak"}
    </button>
  );
}

export default VoiceButton;