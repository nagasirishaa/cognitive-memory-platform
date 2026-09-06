import { useEffect, useState } from "react";
import { getReminders } from "../services/api";

function Reminders() {

  const [reminders, setReminders] =
    useState<any[]>([]);

  useEffect(() => {

    getReminders()
      .then((data) => setReminders(data));

  }, []);

  return (
    <div className="page-container">

      <h1>🔔 Reminders</h1>

      {reminders.map((reminder) => (

        <div
          className="reminder-card"
          key={reminder.id}
        >

          <h2>
            {reminder.title}
          </h2>

          <p>
            ⏰ {reminder.time}
          </p>

        </div>

      ))}

    </div>
  );
}

export default Reminders;