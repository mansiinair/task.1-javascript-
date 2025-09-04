import React from "react";
import Boards from "./components/Boards";

function App() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f9f9f9", minHeight: "100vh" }}>
      <header style={{ background: "#4CAF50", padding: "15px", color: "white" }}>
        <h1>Task Manager - Day 18</h1>
      </header>

      <main style={{ padding: "20px" }}>
        <Boards />
      </main>
    </div>
  );
}

export default App;
