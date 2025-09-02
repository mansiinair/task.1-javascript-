require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// ✅ Assign port (from .env or fallback 5000)
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 🔹 Temporary in-memory todos (resets when server restarts)
let todos = [
  { id: 1, text: "Learn React" },
  { id: 2, text: "Build a To-Do App" }
];

// ✅ Default route for testing
app.get("/", (req, res) => {
  res.send("🚀 Backend is running! Go to /api/todos");
});

// ✅ GET all todos
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

// ✅ POST add todo
app.post("/api/todos", (req, res) => {
  const newTodo = { id: Date.now(), text: req.body.text };
  todos.push(newTodo);
  res.json(newTodo);
});

// ✅ DELETE a todo
app.delete("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== id);
  res.json({ success: true });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:5000`);
});

