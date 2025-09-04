const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow frontend
    methods: ["GET", "POST"],
  },
});

const users = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  // When user joins
  socket.on("join", (username) => {
    users[socket.id] = username;
    socket.broadcast.emit("notification", `${username} joined the chat`);
    io.emit("updateUsers", Object.values(users));
  });

  // When user sends text message
  socket.on("sendMessage", (msg) => {
    io.emit("receiveMessage", msg);
  });

  // When user sends image
  socket.on("sendImage", (data) => {
    io.emit("receiveMessage", {
      user: users[socket.id],
      text: "",
      image: data,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });
  });

  // Typing indicator
  socket.on("typing", (msg) => {
    socket.broadcast.emit("showTyping", msg);
  });

  // When user disconnects
  socket.on("disconnect", () => {
    const username = users[socket.id];
    if (username) {
      socket.broadcast.emit("notification", `${username} left the chat`);
      delete users[socket.id];
      io.emit("updateUsers", Object.values(users));
    }
    console.log("A user disconnected");
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO chat server running on http://localhost:${PORT}`);
});
