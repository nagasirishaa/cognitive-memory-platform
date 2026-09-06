import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CaregiverDashboard from "./pages/CaregiverDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientHome from "./pages/PatientHome";
import Games from "./pages/Games";
import MemoryAssistant from "./pages/MemoryAssistant";
import Family from "./pages/Family";
import Reminders from "./pages/Reminders";
import Progress from "./pages/Progress";

import MatchingGame from "./games/MatchingGame";
import SequenceGame from "./games/SequenceGame";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />
         <Route
  path="/register"
  element={<Register />}
/>
        {/* Home */}
        <Route
          path="/home"
          element={<PatientHome />}
        />
        <Route
  path="/caregiver"
  element={<CaregiverDashboard />}
/>
        {/* Games */}
        <Route
          path="/games"
          element={<Games />}
        />

        <Route
          path="/games/matching"
          element={<MatchingGame />}
        />

        <Route
          path="/games/sequence"
          element={<SequenceGame />}
        />

        {/* Other Pages */}
        <Route
          path="/assistant"
          element={<MemoryAssistant />}
        />

        <Route
          path="/family"
          element={<Family />}
        />

        <Route
          path="/reminders"
          element={<Reminders />}
        />

        <Route
          path="/progress"
          element={<Progress />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;