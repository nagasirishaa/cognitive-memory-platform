import { useEffect, useState } from "react";
import {
  getReminders,
  addReminder,
} from "../services/api";

function Reminders() {
  const [reminders, setReminders] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [addingReminder, setAddingReminder] =
    useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const patientId = user?.patientId;

  async function loadReminders() {
    if (!patientId) return;

    try {
      const data = await getReminders(patientId);
      setReminders(data);
    } catch (error) {
      console.error(
        "Failed to load reminders:",
        error
      );
    }
  }

  useEffect(() => {
    loadReminders();
  }, [patientId]);

  async function handleAddReminder() {
    if (!title || !date || !time) {
      alert(
        "Please enter reminder title, date and time."
      );
      return;
    }

    if (!patientId) {
      alert(
        "Patient information was not found. Please login again."
      );
      return;
    }

    try {
      setAddingReminder(true);

      const data = await addReminder({
        patientId,
        title,
        description,
        date,
        time,
      });

      if (!data.success) {
        alert(
          data.message ||
            "Failed to add reminder."
        );
        return;
      }

      alert("Reminder added successfully!");

      // Clear form
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");

      // Reload reminders from database
      await loadReminders();
    } catch (error) {
      console.error(
        "Failed to add reminder:",
        error
      );

      alert(
        "Unable to add reminder. Please make sure the backend is running."
      );
    } finally {
      setAddingReminder(false);
    }
  }

  return (
    <div className="page-container">
      <h1>🔔 Reminders</h1>

      <p>
        Add and manage important daily reminders.
      </p>

      {/* Add Reminder Form */}
      <div className="family-card">
        <h2>➕ Add Reminder</h2>

        <label>Reminder Title</label>

        <input
          type="text"
          placeholder="Example: Take medicine"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <label>Description</label>

        <input
          type="text"
          placeholder="Example: Take after breakfast"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <label>Date</label>

        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
        />

        <label>Time</label>

        <input
          type="time"
          value={time}
          onChange={(e) =>
            setTime(e.target.value)
          }
        />

        <button
          onClick={handleAddReminder}
          disabled={addingReminder}
          style={{
            marginTop: "15px",
            padding: "10px 16px",
            cursor: "pointer",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          {addingReminder
            ? "Adding..."
            : "Add Reminder"}
        </button>
      </div>

      {/* Existing Reminders */}
      <div className="family-card">
        <h2>📋 My Reminders</h2>

        {reminders.length === 0 ? (
          <p>No reminders scheduled yet.</p>
        ) : (
          reminders.map((reminder) => (
            <div
              className="reminder-card"
              key={reminder._id}
            >
              <h2>{reminder.title}</h2>

              <p>
                ⏰ {reminder.time}
              </p>

              {reminder.description && (
                <p>
                  {reminder.description}
                </p>
              )}

              <p>
                📅 {reminder.date}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Reminders;