import React, { useEffect, useState } from "react";

function Boards() {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");
  const [newTasks, setNewTasks] = useState({}); // track input for each board

  // Fetch boards from backend
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/boards");
        const data = await response.json();
        setBoards(data);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };
    fetchBoards();
  }, []);

  // Add new board
  const addBoard = async () => {
    if (!newBoardName.trim()) return;

    try {
      const response = await fetch("http://localhost:5000/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newBoardName }),
      });

      const board = await response.json();
      setBoards([...boards, board]);
      setNewBoardName("");
    } catch (error) {
      console.error("Error adding board:", error);
    }
  };

  // Add new task to board
  const addTask = async (boardId) => {
    if (!newTasks[boardId]?.trim()) return;

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTasks[boardId],
          description: "New task",
          boardId,
        }),
      });

      const task = await response.json();

      // update UI immediately
      setBoards(
        boards.map((b) =>
          b.id === boardId ? { ...b, tasks: [...b.tasks, task] } : b
        )
      );

      // clear input
      setNewTasks({ ...newTasks, [boardId]: "" });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>📋 Task Boards</h1>

      {/* Add new board */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          placeholder="Enter new board name"
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        <button
          onClick={addBoard}
          style={{
            padding: "10px 15px",
            borderRadius: "6px",
            border: "none",
            background: "#0077cc",
            color: "white",
            cursor: "pointer",
            transition: "0.2s",
          }}
        >
          ➕ Add Board
        </button>
      </div>

      {/* Boards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {boards.map((board) => (
          <div
            key={board.id}
            style={{
              background: "#f4f4f4",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h2 style={{ color: "#0077cc", marginBottom: "10px" }}>
              {board.name}
            </h2>

            {/* Tasks */}
            <div>
              {board.tasks && board.tasks.length > 0 ? (
                board.tasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      background: "#fff",
                      marginBottom: "10px",
                      padding: "10px",
                      borderRadius: "6px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      transition: "0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#e6f2ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#fff")
                    }
                  >
                    <h3 style={{ margin: 0, color: "#444" }}>{task.title}</h3>
                    <p
                      style={{
                        margin: "5px 0",
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      {task.description}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ color: "#999" }}>No tasks yet</p>
              )}
            </div>

            {/* Add new task */}
            <div style={{ marginTop: "10px" }}>
              <input
                type="text"
                value={newTasks[board.id] || ""}
                onChange={(e) =>
                  setNewTasks({ ...newTasks, [board.id]: e.target.value })
                }
                placeholder="New task title"
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  marginRight: "5px",
                }}
              />
              <button
                onClick={() => addTask(board.id)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#28a745",
                  color: "white",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
              >
                ➕ Add Task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Boards;
