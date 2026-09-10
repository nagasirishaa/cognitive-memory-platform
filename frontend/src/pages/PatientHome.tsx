import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPatient, getMemories } from "../services/api";

function PatientHome() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState<any>(null);
  const [memories, setMemories] = useState<any[]>([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);
    const patientId = user?.patientId;

    if (!patientId) {
      return;
    }

    loadPatientData(patientId);
  }, [navigate]);

  const loadPatientData = async (patientId: string) => {
    try {
      const patientData = await getPatient(patientId);

      if (patientData.success) {
        setPatient(patientData.patient);
      }

      const memoryData = await getMemories(patientId);
      setMemories(memoryData || []);
    } catch (error) {
      console.error("Failed to load patient data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const firstName =
    patient?.name?.split(" ")[0] || "Friend";

  const language =
    patient?.language || "English";

  const memoryOfTheDay =
    memories.length > 0 ? memories[0] : null;

  return (
    <div className="patient-home-page">

      {/* HEADER */}
      <header className="patient-header">

        <div className="brand-area">
          <div className="brand-icon">
            🧠
          </div>

          <div>
            <h1>SMRITI AI</h1>
            <p>Your Memory Companion</p>
          </div>
        </div>

        <div className="header-actions">

          <div className="language-pill">
            🌐 {language}
          </div>

          {/* PROFILE BUTTON */}
          <div className="profile-container">

            <button
              type="button"
              className="profile-button"
              onClick={() =>
                setShowProfileMenu(
                  !showProfileMenu
                )
              }
              title="Profile"
              aria-label="Open profile menu"
            >
              👤
            </button>

            {/* PROFILE MENU */}
            {showProfileMenu && (
              <div className="profile-menu">

                <div className="profile-menu-header">

                  <div className="profile-avatar">
                    👤
                  </div>

                  <div>
                    <h3>
                      {patient?.name || "Patient"}
                    </h3>

                    <p>
                      {language}
                    </p>
                  </div>

                </div>

                <div className="profile-menu-divider" />

                <button
                  type="button"
                  className="profile-menu-item"
                  onClick={() =>
                    setShowProfileMenu(false)
                  }
                >
                  👤
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  className="profile-menu-item logout-item"
                  onClick={handleLogout}
                >
                  🚪
                  <span>Logout</span>
                </button>

              </div>
            )}

          </div>

        </div>

      </header>

      {/* MAIN CONTENT */}
      <main className="patient-main">

        {/* WELCOME SECTION */}
        <section className="welcome-section">

          <div>

            <p className="welcome-small">
              Welcome back 🌷
            </p>

            <h2>
              Good morning, {firstName}!
            </h2>

            <p className="welcome-description">
              Take your time. We're here to help you
              remember, connect, and enjoy your day.
            </p>

          </div>

          <div className="welcome-decoration">
            🌿
          </div>

        </section>

        {/* DAILY MEMORY JOURNEY */}
        <section className="daily-card">

          <div className="daily-icon">
            🌱
          </div>

          <div className="daily-content">

            <p className="section-label">
              TODAY'S MEMORY JOURNEY
            </p>

            <h3>
              Keep your mind active
            </h3>

            <p>
              Explore a game, talk with SMRITI,
              or revisit a special memory.
            </p>

            <div className="progress-track">

              <div
                className="progress-fill"
                style={{
                  width: "45%",
                }}
              />

            </div>

            <span className="progress-text">
              Your journey continues today
            </span>

          </div>

          <button
            type="button"
            className="daily-button"
            onClick={() =>
              navigate("/games")
            }
          >
            CONTINUE →
          </button>

        </section>

        {/* MEMORY OF THE DAY */}
        {memoryOfTheDay && (
          <section className="memory-highlight">

            <div className="memory-highlight-icon">
              💛
            </div>

            <div>

              <p className="section-label">
                MEMORY OF THE DAY
              </p>

              <h3>
                {memoryOfTheDay.title}
              </h3>

              <p>
                {memoryOfTheDay.description}
              </p>

            </div>

          </section>
        )}

        {/* ACTIVITIES */}
        <div className="action-heading">

          <p className="section-label">
            YOUR ACTIVITIES
          </p>

          <h2>
            What would you like to do?
          </h2>

        </div>

        <section className="action-grid">

          {/* MEMORY GAMES */}
          <button
            type="button"
            className="action-card games-card"
            onClick={() =>
              navigate("/games")
            }
          >

            <div className="action-icon">
              🧠
            </div>

            <div className="action-text">

              <h3>
                Memory Games
              </h3>

              <p>
                Exercise your mind with
                fun activities.
              </p>

            </div>

            <span className="action-arrow">
              →
            </span>

          </button>

          {/* MEMORY ASSISTANT */}
          <button
            type="button"
            className="action-card assistant-card"
            onClick={() =>
              navigate("/assistant")
            }
          >

            <div className="action-icon">
              💬
            </div>

            <div className="action-text">

              <h3>
                Talk with SMRITI
              </h3>

              <p>
                Ask about your family
                and memories.
              </p>

            </div>

            <span className="action-arrow">
              →
            </span>

          </button>

          {/* FAMILY */}
          <button
            type="button"
            className="action-card family-card"
            onClick={() =>
              navigate("/family")
            }
          >

            <div className="action-icon">
              👨‍👩‍👧
            </div>

            <div className="action-text">

              <h3>
                My Family
              </h3>

              <p>
                Remember the people
                you love.
              </p>

            </div>

            <span className="action-arrow">
              →
            </span>

          </button>

          {/* REMINDERS */}
          <button
            type="button"
            className="action-card reminder-card"
            onClick={() =>
              navigate("/reminders")
            }
          >

            <div className="action-icon">
              🔔
            </div>

            <div className="action-text">

              <h3>
                Reminders
              </h3>

              <p>
                Keep track of important
                things.
              </p>

            </div>

            <span className="action-arrow">
              →
            </span>

          </button>

        </section>

        {/* PROGRESS */}
        <button
          type="button"
          className="progress-card"
          onClick={() =>
            navigate("/progress")
          }
        >

          <div className="progress-card-icon">
            📊
          </div>

          <div>

            <p className="section-label">
              YOUR PROGRESS
            </p>

            <h3>
              See how you're doing
            </h3>

          </div>

          <span>
            View →
          </span>

        </button>

        {/* ENCOURAGEMENT */}
        <div className="encouragement">

          <span>🌸</span>

          <p>
            You're doing wonderfully today.
          </p>

          <span>🌸</span>

        </div>

      </main>

    </div>
  );
}

export default PatientHome;