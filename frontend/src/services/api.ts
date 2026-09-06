export async function getPatient() {
  return {
    id: 1,
    name: "Patient",
    age: 70,
    language: "English",
  };
}

export async function getFamilyMembers() {
  return [
    {
      id: 1,
      name: "Ravi",
      relation: "Son",
    },
    {
      id: 2,
      name: "Priya",
      relation: "Daughter",
    },
    {
      id: 3,
      name: "Anil",
      relation: "Friend",
    },
  ];
}

export async function getReminders() {
  return [
    {
      id: 1,
      title: "Take medicine",
      time: "10:00 AM",
    },
    {
      id: 2,
      title: "Call Ravi",
      time: "5:00 PM",
    },
  ];
}

export async function saveGameSession(data: any) {
  console.log("Game result:", data);

  return {
    success: true,
    message: "Game result saved locally",
  };
}

export async function askAssistant(question: string) {
  console.log("Question:", question);

  return {
    answer: "Ravi is your son.",
  };
}