import { useEffect, useState } from "react";

import {
  getPatient,
  getPatientsByCaregiver,
  createPatient,
  getGameSessions,
  getFamilyMembers,
  getReminders,
  getRecommendations,
} from "../services/api";

function CaregiverDashboard() {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] =
    useState<string>("");

  const [patient, setPatient] = useState<any>(null);
  const [gameSessions, setGameSessions] = useState<any[]>([]);
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [recommendations, setRecommendations] =
    useState<any[]>([]);

  const [loadingPatients, setLoadingPatients] =
    useState(true);

  const [loadingDashboard, setLoadingDashboard] =
    useState(false);

  // Add Patient form
  const [showAddPatient, setShowAddPatient] =
    useState(false);

  const [newPatientName, setNewPatientName] =
    useState("");

  const [newPatientAge, setNewPatientAge] =
    useState("");

  const [newPatientLanguage, setNewPatientLanguage] =
    useState("Assamese");

  const [creatingPatient, setCreatingPatient] =
    useState(false);

  // Get logged-in caregiver
  const storedUser = localStorage.getItem("user");
  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const caregiverId = user?.id;

  // =========================
  // LOAD PATIENTS
  // =========================

  useEffect(() => {
    async function loadPatients() {
      if (!caregiverId) {
        setLoadingPatients(false);
        return;
      }

      try {
        const data =
          await getPatientsByCaregiver(caregiverId);

        setPatients(data);

        if (data.length > 0) {
          setSelectedPatientId(data[0]._id);
        }
      } catch (error) {
        console.error(
          "Failed to load patients:",
          error
        );
      } finally {
        setLoadingPatients(false);
      }
    }

    loadPatients();
  }, [caregiverId]);

  // =========================
  // LOAD SELECTED PATIENT DATA
  // =========================

  useEffect(() => {
    async function loadDashboard() {
      if (!selectedPatientId) {
        return;
      }

      try {
        setLoadingDashboard(true);

        const patientData =
          await getPatient(selectedPatientId);

        if (
          patientData.success &&
          patientData.patient
        ) {
          setPatient(patientData.patient);
        }

        const sessions =
          await getGameSessions(selectedPatientId);

        setGameSessions(sessions);

        const family =
          await getFamilyMembers(selectedPatientId);

        setFamilyMembers(family);

        const reminderData =
          await getReminders(selectedPatientId);

        setReminders(reminderData);

        const recommendationData =
          await getRecommendations(selectedPatientId);

        setRecommendations(
          recommendationData
        );
      } catch (error) {
        console.error(
          "Failed to load caregiver dashboard:",
          error
        );
      } finally {
        setLoadingDashboard(false);
      }
    }

    loadDashboard();
  }, [selectedPatientId]);

  // =========================
  // CREATE PATIENT
  // =========================

  async function handleCreatePatient() {
    if (!newPatientName || !newPatientAge) {
      alert(
        "Please enter patient name and age."
      );
      return;
    }

    if (!caregiverId) {
      alert(
        "Caregiver information was not found. Please login again."
      );
      return;
    }

    try {
      setCreatingPatient(true);

      const data = await createPatient({
        name: newPatientName,
        age: Number(newPatientAge),
        language: newPatientLanguage,
        caregiverId: caregiverId,
      });

      if (!data.success) {
        alert(
          data.message ||
            "Failed to create patient."
        );
        return;
      }

      const newPatient = data.patient;

      alert(
        `Patient created successfully!\n\nPatient ID:\n${newPatient._id}\n\nGive this ID to the patient when they register.`
      );

      setNewPatientName("");
      setNewPatientAge("");
      setNewPatientLanguage("Assamese");
      setShowAddPatient(false);

      const updatedPatients =
        await getPatientsByCaregiver(
          caregiverId
        );

      setPatients(updatedPatients);

      setSelectedPatientId(
        newPatient._id
      );
    } catch (error) {
      console.error(
        "Failed to create patient:",
        error
      );

      alert(
        "Unable to create patient. Please make sure the backend is running."
      );
    } finally {
      setCreatingPatient(false);
    }
  }

  // =========================
  // CALCULATE SUMMARY
  // =========================

  const totalGames = gameSessions.length;

  const averageAccuracy =
    totalGames > 0
      ? Math.round(
          gameSessions.reduce(
            (sum, session) =>
              sum + Number(session.accuracy || 0),
            0
          ) / totalGames
        )
      : 0;

  const latestSession =
    gameSessions.length > 0
      ? gameSessions[0]
      : null;

  // =========================
  // LOADING / AUTH CHECK
  // =========================

  if (loadingPatients) {
    return (
      <div className="page-container">
        <h1>👩‍⚕️ Caregiver Dashboard</h1>
        <p>Loading patients...</p>
      </div>
    );
  }

  if (!caregiverId) {
    return (
      <div className="page-container">
        <h1>👩‍⚕️ Caregiver Dashboard</h1>

        <p>
          Caregiver account information was not
          found. Please login again.
        </p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>👩‍⚕️ Caregiver Dashboard</h1>

      <p>
        Monitor your patients' cognitive
        activities and daily progress.
      </p>

      {/* =========================
          PATIENT SELECTION
      ========================= */}

      <div className="family-card">
        <h2>👥 My Patients</h2>

        <button
          onClick={() =>
            setShowAddPatient(
              !showAddPatient
            )
          }
          style={{
            marginBottom: "15px",
            padding: "10px 16px",
            cursor: "pointer",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          {showAddPatient
            ? "✖ Cancel"
            : "➕ Add Patient"}
        </button>

        {/* ADD PATIENT FORM */}

        {showAddPatient && (
          <div
            style={{
              padding: "15px",
              marginBottom: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <h3>➕ Add New Patient</h3>

            <label>Patient Name</label>

            <input
              type="text"
              placeholder="Enter patient name"
              value={newPatientName}
              onChange={(e) =>
                setNewPatientName(
                  e.target.value
                )
              }
            />

            <label>Age</label>

            <input
              type="number"
              placeholder="Enter age"
              value={newPatientAge}
              onChange={(e) =>
                setNewPatientAge(
                  e.target.value
                )
              }
            />

            <label>Language</label>

            <select
              value={newPatientLanguage}
              onChange={(e) =>
                setNewPatientLanguage(
                  e.target.value
                )
              }
            >
              <option value="Assamese">
                Assamese
              </option>

              <option value="English">
                English
              </option>

              <option value="Hindi">
                Hindi
              </option>

              <option value="Bengali">
                Bengali
              </option>

              <option value="Bodo">
                Bodo
              </option>

              <option value="Khasi">
                Khasi
              </option>

              <option value="Mizo">
                Mizo
              </option>

              <option value="Manipuri">
                Manipuri / Meitei
              </option>
            </select>

            <button
              onClick={handleCreatePatient}
              disabled={creatingPatient}
              style={{
                marginTop: "15px",
                padding: "10px 16px",
                cursor: "pointer",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              {creatingPatient
                ? "Creating..."
                : "Create Patient"}
            </button>
          </div>
        )}

        {/* PATIENT LIST */}

        {patients.length > 0 ? (
          patients.map((p) => (
            <button
              key={p._id}
              onClick={() =>
                setSelectedPatientId(
                  p._id
                )
              }
              style={{
                display: "block",
                width: "100%",
                marginBottom: "10px",
                padding: "12px",
                textAlign: "left",
                cursor: "pointer",
                border:
                  selectedPatientId ===
                  p._id
                    ? "2px solid #333"
                    : "1px solid #ccc",
                borderRadius: "8px",
                background:
                  selectedPatientId ===
                  p._id
                    ? "#f0f0f0"
                    : "white",
              }}
            >
              <strong>
                👤 {p.name}
              </strong>

              <br />

              <span>
                Age: {p.age} • Language:{" "}
                {p.language}
              </span>
            </button>
          ))
        ) : (
          <p>
            No patients are connected to this
            caregiver yet.
          </p>
        )}
      </div>

      {/* =========================
          SELECTED PATIENT DASHBOARD
      ========================= */}

      {selectedPatientId && (
        <>
          {loadingDashboard ? (
            <div className="family-card">
              <p>
                Loading patient dashboard...
              </p>
            </div>
          ) : (
            <>
              {/* PATIENT INFORMATION */}

              <div className="family-card">
                <h2>
                  👤 Patient Information
                </h2>

                {patient ? (
                  <>
                    <p>
                      <strong>Name:</strong>{" "}
                      {patient.name}
                    </p>

                    <p>
                      <strong>Age:</strong>{" "}
                      {patient.age}
                    </p>

                    <p>
                      <strong>
                        Language:
                      </strong>{" "}
                      {patient.language}
                    </p>

                    <p>
                      <strong>
                        Patient ID:
                      </strong>{" "}
                      {selectedPatientId}
                    </p>

                    <p
                      style={{
                        fontSize: "13px",
                      }}
                    >
                      Give this Patient ID to
                      the patient when they
                      register their account.
                    </p>
                  </>
                ) : (
                  <p>
                    Patient information not
                    found.
                  </p>
                )}
              </div>

              {/* =========================
                  SUMMARY CARDS
              ========================= */}

              <div className="family-list">
                <div className="family-card">
                  <h2>🎮 Games Played</h2>

                  <p
                    style={{
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                  >
                    {totalGames}
                  </p>
                </div>

                <div className="family-card">
                  <h2>📈 Average Accuracy</h2>

                  <p
                    style={{
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                  >
                    {averageAccuracy}%
                  </p>
                </div>

                <div className="family-card">
                  <h2>👨‍👩‍👧 Family Members</h2>

                  <p
                    style={{
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                  >
                    {familyMembers.length}
                  </p>
                </div>

                <div className="family-card">
                  <h2>🔔 Reminders</h2>

                  <p
                    style={{
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                  >
                    {reminders.length}
                  </p>
                </div>
              </div>

              {/* =========================
                  RECENT ACTIVITY
              ========================= */}

              <div className="family-card">
                <h2>
                  🧠 Recent Activity
                </h2>

                {latestSession ? (
                  <>
                    <p>
                      <strong>
                        Game:
                      </strong>{" "}
                      {
                        latestSession.gameName
                      }
                    </p>

                    <p>
                      <strong>
                        Score:
                      </strong>{" "}
                      {
                        latestSession.score
                      }
                    </p>

                    <p>
                      <strong>
                        Accuracy:
                      </strong>{" "}
                      {
                        latestSession.accuracy
                      }
                      %
                    </p>

                    <p>
                      <strong>
                        Difficulty:
                      </strong>{" "}
                      {
                        latestSession.difficulty
                      }
                    </p>

                    <p>
                      <strong>
                        Played:
                      </strong>{" "}
                      {latestSession.playedAt
                        ? new Date(
                            latestSession.playedAt
                          ).toLocaleString()
                        : "Recently"}
                    </p>
                  </>
                ) : (
                  <p>
                    No games played yet.
                  </p>
                )}
              </div>

              {/* =========================
                  FAMILY MEMBERS
              ========================= */}

              <div className="family-card">
                <h2>
                  👨‍👩‍👧 Family Members
                </h2>

                {familyMembers.length >
                0 ? (
                  familyMembers.map(
                    (member) => (
                      <div
                        key={member.id}
                        className="reminder-card"
                      >
                        <p>
                          <strong>
                            {
                              member.name
                            }
                          </strong>
                        </p>

                        <p>
                          {
                            member.relation
                          }

                          {member.age
                            ? ` • Age ${member.age}`
                            : ""}
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p>
                    No family members added
                    yet.
                  </p>
                )}
              </div>

              {/* =========================
                  REMINDERS
              ========================= */}

              <div className="family-card">
                <h2>
                  🔔 Reminders
                </h2>

                {reminders.length >
                0 ? (
                  reminders.map(
                    (reminder) => (
                      <div
                        key={
                          reminder._id
                        }
                        className="reminder-card"
                      >
                        <p>
                          <strong>
                            {
                              reminder.title
                            }
                          </strong>
                        </p>

                        {reminder.description && (
                          <p>
                            {
                              reminder.description
                            }
                          </p>
                        )}

                        <p>
                          📅{" "}
                          {
                            reminder.date
                          }
                        </p>

                        <p>
                          ⏰{" "}
                          {
                            reminder.time
                          }
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p>
                    No reminders scheduled.
                  </p>
                )}
              </div>

              {/* =========================
                  PERSONALIZED RECOMMENDATION
              ========================= */}

              <div className="family-card">
                <h2>
                  ⭐ Personalized
                  Recommendation
                </h2>

                {recommendations.length >
                0 ? (
                  <>
                    <p>
                      <strong>
                        Game:
                      </strong>{" "}
                      {
                        recommendations[0]
                          .gameName
                      }
                    </p>

                    <p>
                      <strong>
                        Current Difficulty:
                      </strong>{" "}
                      {
                        recommendations[0]
                          .currentDifficulty
                      }
                    </p>

                    <p>
                      <strong>
                        Recommended Difficulty:
                      </strong>{" "}
                      {
                        recommendations[0]
                          .recommendedDifficulty
                      }
                    </p>

                    <p>
                      <strong>
                        Reason:
                      </strong>{" "}
                      {
                        recommendations[0]
                          .reason
                      }
                    </p>

                    <p>
                      <strong>
                        Accuracy:
                      </strong>{" "}
                      {
                        recommendations[0]
                          .accuracy
                      }
                      %
                    </p>
                  </>
                ) : (
                  <p>
                    No personalized
                    recommendation
                    available yet.
                  </p>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default CaregiverDashboard;