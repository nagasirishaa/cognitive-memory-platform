import { useRef, useState } from "react";

interface VoiceButtonProps {
  onText: (text: string) => void;
}

function VoiceButton({ onText }: VoiceButtonProps) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser. Please use Google Chrome."
      );
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognitionRef.current = recognition;

    // English with Indian pronunciation support
    recognition.lang = "en-IN";

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("Voice recognition started");
      setListening(true);
    };

    recognition.onresult = (event: any) => {
      const text =
        event.results?.[0]?.[0]?.transcript || "";

      console.log("Recognized text:", text);

      if (text.trim()) {
        onText(text);
      }

      setListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setListening(false);

      if (event.error === "not-allowed") {
        alert(
          "Microphone permission was denied. Please allow microphone access in your browser."
        );
      } else if (event.error === "no-speech") {
        alert(
          "I could not hear anything. Please try speaking again."
        );
      } else if (event.error === "audio-capture") {
        alert(
          "No microphone was detected. Please check your microphone."
        );
      } else {
        alert(
          "Could not understand your voice. Please try again."
        );
      }
    };

    recognition.onend = () => {
      console.log("Voice recognition ended");
      setListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch (error) {
      console.error(
        "Could not start speech recognition:",
        error
      );

      setListening(false);
      recognitionRef.current = null;
    }
  };

  return (
    <button
      type="button"
      className={`voice-button ${
        listening ? "voice-button-listening" : ""
      }`}
      onClick={startListening}
      aria-label={
        listening
          ? "Stop listening"
          : "Start voice input"
      }
    >
      {listening ? "🔴 Listening..." : "🎤 Speak"}
    </button>
  );
}

export default VoiceButton;