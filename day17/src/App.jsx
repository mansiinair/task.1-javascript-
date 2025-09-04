import React, { useState, useEffect } from "react";
import socket from "./socket";

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const emojis = ["😀","😂","😍","🔥","😎","👍","🎉","❤️","🙏","🤔"];

  const handleJoin = () => {
    if (username.trim()) {
      socket.emit("join", username);
      setJoined(true);
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      const msgData = {
        user: username,
        text: message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      socket.emit("sendMessage", msgData);
      setMessage("");
      socket.emit("typing", "");
    }
  };

  // Typing event
  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", e.target.value ? `${username} is typing...` : "");
  };

  // Handle image upload
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      socket.emit("sendImage", reader.result); // send base64 image
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("notification", (note) => {
      setMessages((prev) => [...prev, { user: "System", text: note, time: "" }]);
    });

    socket.on("updateUsers", (userList) => {
      setUsers(userList);
    });

    socket.on("showTyping", (msg) => {
      setTyping(msg);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("notification");
      socket.off("updateUsers");
      socket.off("showTyping");
    };
  }, []);

  if (!joined) {
    return (
      <div className="join-screen">
        <div className="join-box">
          <h2>Join Chat 💬</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleJoin}>Join</button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>👥 Users Online</h3>
        <ul>
          {users.map((u, i) => (
            <li key={i}>{u}</li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="chat-box">
        <div className="messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message ${msg.user === username ? "my-message" : msg.user === "System" ? "system-message" : "other-message"}`}
            >
              {msg.user !== "System" && <strong>{msg.user}</strong>}
              {msg.text && <span>{msg.text}</span>}
              {msg.image && <img src={msg.image} alt="sent" className="chat-img" />}
              {msg.time && <small>{msg.time}</small>}
            </div>
          ))}
        </div>

        {/* Typing indicator */}
        {typing && <div className="typing">{typing}</div>}

        {/* Input Area */}
        <div className="input-area">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={handleTyping}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          {/* Emoji button */}
          <button onClick={() => setShowEmoji(!showEmoji)}>😊</button>

          {/* Emoji picker */}
          {showEmoji && (
            <div className="emoji-picker">
              {emojis.map((em, i) => (
                <span key={i} onClick={() => setMessage(message + em)}>{em}</span>
              ))}
            </div>
          )}

          {/* Image upload */}
          <label className="upload-btn">
            📷
            <input type="file" accept="image/*" onChange={handleImage} hidden />
          </label>

          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
