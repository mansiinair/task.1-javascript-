// index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

const app = express();
app.use(express.json()); // Middleware to parse JSON

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Hello, Day 14 Auth project!");
});

// ✅ Signup route
app.post("/api/auth/signup", (req, res) => {
  const { username, email, password } = req.body;
  res.json({ message: "Signup route hit", data: { username, email, password } });
});

// ✅ Login route
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  res.json({ message: "Login route hit", data: { email, password } });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
