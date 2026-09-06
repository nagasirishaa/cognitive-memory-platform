const API_BASE_URL = "http://localhost:5000/api";

// ======================================================
// AUTHENTICATION
// ======================================================

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return response.json();
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  role: string;
  patientId?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

// ======================================================
// PATIENTS
// ======================================================

export async function getPatient(patientId: string) {
  const response = await fetch(
    `${API_BASE_URL}/patients/${patientId}`
  );

  return response.json();
}

export async function getPatientsByCaregiver(
  caregiverId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/patients/caregiver/${caregiverId}`
  );

  const data = await response.json();

  return data.patients || [];
}

// IMPORTANT:
// This function was missing and caused the blank frontend.
export async function createPatient(data: {
  name: string;
  age: number;
  language: string;
  caregiverId: string;
}) {
  const response = await fetch(
    `${API_BASE_URL}/patients`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
}

// ======================================================
// FAMILY MEMBERS
// ======================================================

export async function getFamilyMembers(
  patientId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/family/${patientId}`
  );

  const data = await response.json();

  return (data.familyMembers || []).map(
    (member: any) => ({
      id: member._id,
      name: member.name,
      relation: member.relationship,
      age: member.age,
    })
  );
}

export async function addFamilyMember(data: {
  patientId: string;
  name: string;
  relationship: string;
  age?: number;
}) {
  const response = await fetch(
    `${API_BASE_URL}/family`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
}

// ======================================================
// MEMORIES
// ======================================================

export async function getMemories(
  patientId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/memories/${patientId}`
  );

  const data = await response.json();

  return data.memories || [];
}

export async function addMemory(data: {
  patientId: string;
  title: string;
  description: string;
  category: string;
}) {
  const response = await fetch(
    `${API_BASE_URL}/memories`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
}

// ======================================================
// REMINDERS
// ======================================================

export async function getReminders(
  patientId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/reminders/${patientId}`
  );

  const data = await response.json();

  return data.reminders || [];
}

export async function addReminder(data: {
  patientId: string;
  title: string;
  description?: string;
  date: string;
  time: string;
}) {
  const response = await fetch(
    `${API_BASE_URL}/reminders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
}

// ======================================================
// GAME SESSIONS
// ======================================================

export async function saveGameSession(data: {
  patientId: string;
  gameName: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  difficulty: string;
}) {
  const response = await fetch(
    `${API_BASE_URL}/game-sessions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
}

export async function getGameSessions(
  patientId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/game-sessions/${patientId}`
  );

  const data = await response.json();

  return data.gameSessions || [];
}

// ======================================================
// RECOMMENDATIONS
// ======================================================

export async function getRecommendations(
  patientId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/recommendations/${patientId}`
  );

  const data = await response.json();

  return data.recommendations || [];
}

// ======================================================
// MEMORY ASSISTANT
// ======================================================

export async function askAssistant(
  question: string,
  patientId: string
) {
  try {
    // Get both caregiver memories AND family members
    const [memories, familyMembers] =
      await Promise.all([
        getMemories(patientId),
        getFamilyMembers(patientId),
      ]);

    const lowerQuestion = question
      .toLowerCase()
      .replace(/[?.,!]/g, "")
      .trim();

    // --------------------------------------------------
    // SEARCH FAMILY MEMBERS FIRST
    // --------------------------------------------------

    const familyMember = familyMembers.find(
      (member: any) => {
        const name = (member.name || "")
          .toLowerCase()
          .trim();

        return (
          lowerQuestion.includes(name) ||
          name.includes(lowerQuestion)
        );
      }
    );

    if (familyMember) {
      let answer = `${familyMember.name} is your ${familyMember.relation}`;

      if (familyMember.age) {
        answer += `. ${familyMember.name} is ${familyMember.age} years old`;
      }

      return {
        answer: answer + ".",
      };
    }

    // --------------------------------------------------
    // SEARCH CAREGIVER MEMORIES
    // --------------------------------------------------

    const stopWords = [
      "who",
      "what",
      "where",
      "when",
      "why",
      "how",
      "is",
      "are",
      "was",
      "were",
      "the",
      "a",
      "an",
      "my",
      "me",
      "your",
      "about",
      "tell",
      "please",
      "can",
      "you",
    ];

    const questionWords = lowerQuestion
      .split(/\s+/)
      .filter(
        (word: string) =>
          word.length > 2 &&
          !stopWords.includes(word)
      );

    const matchingMemory = memories.find(
      (memory: any) => {
        const memoryText =
          `${memory.title} ${memory.description} ${memory.category}`
            .toLowerCase();

        return questionWords.some(
          (word: string) =>
            memoryText.includes(word)
        );
      }
    );

    if (matchingMemory) {
      return {
        answer: matchingMemory.description,
      };
    }

    // --------------------------------------------------
    // INFORMATION NOT FOUND
    // --------------------------------------------------

    return {
      answer:
        "I don't have that information in the memories provided by your caregiver.",
    };
  } catch (error) {
    console.error(
      "Memory Assistant error:",
      error
    );

    return {
      answer:
        "Sorry, I could not retrieve your memory information right now.",
    };
  }
}