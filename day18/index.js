// index.js
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Task Manager API is running 🚀");
});

// ✅ Get all boards with tasks
app.get("/api/boards", async (req, res) => {
  try {
    const boards = await prisma.board.findMany({
      include: {
        tasks: true, // only include tasks since Board has no `columns`
      },
    });
    res.json(boards);
  } catch (error) {
    console.error("Error fetching boards:", error);
    res.status(500).json({ error: "Failed to fetch boards" });
  }
});

// ✅ Create a new board
app.post("/api/boards", async (req, res) => {
  try {
    const { name } = req.body;
    const newBoard = await prisma.board.create({
      data: { name },
    });
    res.json(newBoard);
  } catch (error) {
    console.error("Error creating board:", error);
    res.status(500).json({ error: "Failed to create board" });
  }
});

// ✅ Create a new task in a board
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, boardId } = req.body;
    const newTask = await prisma.task.create({
      data: { title, boardId },
    });
    res.json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
