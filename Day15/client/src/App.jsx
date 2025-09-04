import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [auth, setAuth] = useState(false); // 🔑 basic state (replace with JWT later)

  return (
    <Routes>
      <Route path="/login" element={<Login setAuth={setAuth} />} />
      <Route
        path="/dashboard"
        element={auth ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
